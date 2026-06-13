<?php
namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ActivityLog;


class OrderController extends Controller {
    public function index() { return Order::with('product')->get(); }

    public function store(Request $request) {
        $data = $request->validate([
            'id_product' => 'required|exists:products,id',
            'amount'     => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['id_product']);

        if ($data['amount'] > $product->stock) {
            return response()->json([
                'message' => "Not enough stock. Only {$product->stock} available."
            ], 422);
        }

        $order = Order::create($data);
        $product->decrement('stock', $data['amount']);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'created',   // or 'updated', 'deleted'
            'details' => 'Order "' . $data['id_name'] . '" created',
        ]);

        return $order->load('product');
    }

    public function update(Request $request, Order $order) {
        $data = $request->validate([
            'id_product' => 'required|exists:products,id',
            'amount'     => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['id_product']);

        // Restore old stock first, then check against new amount
        $oldAmount  = $order->amount;
        $oldProduct = Product::findOrFail($order->id_product);
        $oldProduct->increment('stock', $oldAmount);

        if ($data['amount'] > $product->fresh()->stock) {
            // Rollback the restore if validation fails
            $oldProduct->decrement('stock', $oldAmount);
            return response()->json([
                'message' => "Not enough stock. Only {$product->stock} available."
            ], 422);
        }

        $order->update($data);
        $product->decrement('stock', $data['amount']);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',   // or 'updated', 'deleted'
            'details' => 'Order "' . $data['name'] . '" updated',
        ]);

        return $order->load('product');
    }

    public function destroy(Request $request, Order $order) {
        // Restore stock when order is deleted
        $product = Product::find($order->id_product);
        if ($product) $product->increment('stock', $order->amount);

        $order->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'deleted',   // or 'updated', 'deleted'
            'details' => 'Order "' . $request->user()->name . '" deleted',
        ]);

        return response()->noContent();
    }
}