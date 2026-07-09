<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\ActivityLog;


class ProductController extends Controller {
    public function index() {
    return Product::with(['category', 'provider'])->withCount('orders')->get()->map(function ($p) {
        $p->image_url = $p->image
            ? asset('storage/' . str_replace('\\', '/', $p->image))
            : null;
        
        return $p;
    });
}

public function store(Request $request) {
    $data = $request->validate([
        'id_category'        => 'required|exists:categories,id',
        'id_provider'        => 'required|exists:providers,id',
        'name'                => 'required|string',
        'stock'               => 'required|integer|min:0',
        'price'               => 'required|numeric|min:0',
        'reorder_threshold'   => 'required|integer|min:0',
        'image'               => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:4096',
    ]);

    unset($data['image']);

    if ($request->hasFile('image') && $request->file('image')->isValid()) {
        $path = $request->file('image')->store('products', 'public');
        $data['image'] = str_replace('\\', '/', $path);
    }

    $product = Product::create($data);
    $product->load(['category', 'provider']);
    $product->image_url = $product->image
        ? asset('storage/' . str_replace('\\', '/', $product->image))
        : null;

    ActivityLog::create([
        'user_id' => $request->user()->id,
        'action'  => 'created',
        'details' => 'Product "' . $product->name . '" created',
    ]);

    return $product;
}

public function update(Request $request, Product $product) {
    $data = $request->validate([
        'id_category'        => 'required|exists:categories,id',
        'id_provider'        => 'required|exists:providers,id',
        'name'                => 'required|string',
        'stock'               => 'required|integer|min:0',
        'price'               => 'required|numeric|min:0',
        'reorder_threshold'   => 'required|integer|min:0',
        'image'               => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:4096',
    ]);

    unset($data['image']);

    if ($request->hasFile('image') && $request->file('image')->isValid()) {
        if ($product->image) Storage::disk('public')->delete($product->image);
        $path = $request->file('image')->store('products', 'public');
        $data['image'] = str_replace('\\', '/', $path);
    }

    $product->update($data);
    $product->load(['category', 'provider']);
    $product->image_url = $product->image
        ? asset('storage/' . str_replace('\\', '/', $product->image))
        : null;

    ActivityLog::create([
        'user_id' => $request->user()->id,
        'action'  => 'updated',
        'details' => 'Product "' . $product->name . '" updated',
    ]);

    return $product;
}

public function destroy(Request $request, Product $product) {
    $hasUnconfirmedOrders = $product->orders()
        ->where('status', 'pending')
        ->exists();

    if ($hasUnconfirmedOrders) {
        return response()->json([
            'message' => 'Cannot delete a product with pending orders. Confirm them first.'
        ], 422);
    }

    if ($product->image) Storage::disk('public')->delete($product->image);

    $name = $product->name;
    $product->delete();

    ActivityLog::create([
        'user_id' => $request->user()->id,
        'action'  => 'deleted',
        'details' => 'Product "' . $name . '" deleted',
    ]);

    return response()->noContent();
}
}