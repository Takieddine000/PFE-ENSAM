<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\{CategoryController, ProviderController, ProductController, OrderController, UserController};
use App\Models\{Category, Provider, Product, Order};
use App\Models\ActivityLog;

// Public
Route::get('/', fn() => Inertia::render('Home'))->name('home');

require __DIR__.'/auth.php';

// Protected
Route::middleware('auth')->group(function () {

    // Pages
    Route::get('/dashboard',  fn() => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/categories', fn() => Inertia::render('Categories'))->name('categories');
    Route::get('/providers',  fn() => Inertia::render('Providers'))->name('providers');
    Route::get('/products',   fn() => Inertia::render('Products'))->name('products');
    Route::get('/orders',     fn() => Inertia::render('Orders'))->name('orders');
    Route::get('/users',      fn() => Inertia::render('Users'))->name('users');

    // API endpoints
    Route::get('/api/user', fn(Request $request) => $request->user());

    Route::get('/api/dashboard-stats', function () {
        $stockByCategory = \App\Models\Category::withSum('products', 'stock')
            ->get()->map(fn($c) => [
                'category' => $c->name,
                'stock'    => $c->products_sum_stock ?? 0,
            ]);

        $revenueByCategory = \App\Models\Category::with('products.orders')->get()
            ->map(fn($c) => [
                'category' => $c->name,
                'revenue'  => $c->products->sum(fn($p) => $p->orders->sum(fn($o) => $o->amount * $p->price)),
            ])->filter(fn($c) => $c['revenue'] > 0)->values();

        $ordersTrend = collect(range(6, 0))->map(function ($daysAgo) {
            $date   = now()->subDays($daysAgo)->toDateString();
            $orders = \App\Models\Order::whereDate('created_at', $date)->get();
            $revenue = $orders->sum(fn($o) => $o->amount * optional($o->product)->price);
            return [
                'date'    => now()->subDays($daysAgo)->format('M d'),
                'orders'  => $orders->count(),
                'revenue' => round($revenue, 2),
            ];
        });

        $topProducts = \App\Models\Product::withCount('orders')
            ->orderByDesc('orders_count')->take(5)->get()
            ->map(fn($p) => ['name' => $p->name, 'orders' => $p->orders_count]);

        return response()->json([
            'total_categories' => \App\Models\Category::count(),
            'total_providers'  => \App\Models\Provider::count(),
            'total_products'   => \App\Models\Product::count(),
            'total_orders'     => \App\Models\Order::count(),
            'total_revenue'    => \App\Models\Order::join('products', 'orders.id_product', '=', 'products.id')
                                    ->sum(DB::raw('orders.amount * products.price')),
            'low_stock'           => \App\Models\Product::with('category')->where('stock', '<', 5)->get(),
            'recent_orders'       => \App\Models\Order::with('product')->latest()->take(5)->get(),
            'stock_by_category'   => $stockByCategory,
            'revenue_by_category' => $revenueByCategory,
            'orders_trend'        => $ordersTrend,
            'top_products'        => $topProducts,
        ]);
    });

    Route::get('/api/categories', [CategoryController::class, 'index']);
    Route::get('/api/providers',  [ProviderController::class, 'index']);
    Route::get('/api/products',   [ProductController::class,  'index']);
    Route::get('/api/orders',     [OrderController::class,    'index']);
    Route::get('/api/users',      [UserController::class,     'index']);
    Route::post('/api/orders',    [OrderController::class,    'store']);

    Route::put('/api/profile', [UserController::class, 'updateProfile']);

    Route::middleware('admin')->group(function () {
        Route::post('/api/categories',              [CategoryController::class, 'store']);
        Route::put('/api/categories/{category}',    [CategoryController::class, 'update']);
        Route::delete('/api/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/api/providers',               [ProviderController::class, 'store']);
        Route::put('/api/providers/{provider}',     [ProviderController::class, 'update']);
        Route::delete('/api/providers/{provider}',  [ProviderController::class, 'destroy']);

        Route::post('/api/products',                [ProductController::class,  'store']);
        Route::put('/api/products/{product}',       [ProductController::class,  'update']);
        Route::delete('/api/products/{product}',    [ProductController::class,  'destroy']);

        Route::put('/api/orders/{order}',           [OrderController::class,    'update']);
        Route::delete('/api/orders/{order}',        [OrderController::class,    'destroy']);

        Route::put('/api/users/{user}',             [UserController::class,     'update']);
        Route::delete('/api/users/{user}', [UserController::class, 'destroy']);

        Route::delete('/api/activity-logs',      function () {
            ActivityLog::truncate();
            return response()->noContent();
        });

        Route::delete('/api/activity-logs/{log}', function (ActivityLog $log) {
            $log->delete();
            return response()->noContent();
        });

        Route::put('/api/users/{user}/info', [UserController::class, 'updateInfo']);
    });
    Route::put('/api/theme', function (Request $request) {
        $request->validate(['dark_mode' => 'required|boolean']);
        $request->user()->update(['dark_mode' => $request->dark_mode]);
        return response()->json(['dark_mode' => $request->dark_mode]);
    });
});