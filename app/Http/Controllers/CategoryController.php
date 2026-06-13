<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\ActivityLog;


class CategoryController extends Controller {
    public function index() {
    return Category::withCount('products')->get();
}

    public function store(Request $request) {
        $data = $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'created',   // or 'updated', 'deleted'
            'details' => 'Category "' . $data['name'] . '" created',
        ]);

        return Category::create($data);
    }

    public function update(Request $request, Category $category) {
        $data = $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);
        $category->update($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',   // or 'updated', 'deleted'
            'details' => 'Category "' . $data['name'] . '" updated',
        ]);

        return $category;
    }

    public function destroy(Request $request, Category $category) {
        $category->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'deleted',   // or 'updated', 'deleted'
            'details' => 'Category "' . $request->user()->name . '" deleted',
        ]);

        return response()->noContent();
    }
}