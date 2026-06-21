<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Product;
use App\Models\Order;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $homeGoods = Category::create(['name' => 'Home Goods',     'description' => 'Household items and decor']);
        $sports    = Category::create(['name' => 'Sports & Outdoors', 'description' => 'Fitness and outdoor gear']);
        $beauty    = Category::create(['name' => 'Beauty & Health', 'description' => 'Personal care products']);
        $stationery= Category::create(['name' => 'Stationery',     'description' => 'Office and school supplies']);
        $pet       = Category::create(['name' => 'Pet Supplies',   'description' => 'Products for pets']);

        // Providers
        $homewell   = Provider::create(['name' => 'HomeWell']);
        $activegear = Provider::create(['name' => 'ActiveGear']);
        $purelux    = Provider::create(['name' => 'PureLux']);
        $deskco     = Provider::create(['name' => 'DeskCo']);
        $petplanet  = Provider::create(['name' => 'PetPlanet']);

        // Products
        $products = [
            Product::create(['id_category' => $homeGoods->id, 'id_provider' => $homewell->id,   'name' => 'Scented Candle Set',     'stock' => 300, 'price' => 19.99,  'reorder_threshold' => 20]),
            Product::create(['id_category' => $homeGoods->id, 'id_provider' => $homewell->id,   'name' => 'Ceramic Vase',           'stock' => 150, 'price' => 34.99,  'reorder_threshold' => 10]),
            Product::create(['id_category' => $homeGoods->id, 'id_provider' => $homewell->id,   'name' => 'Throw Blanket',          'stock' => 200, 'price' => 29.99,  'reorder_threshold' => 15]),
            Product::create(['id_category' => $homeGoods->id, 'id_provider' => $homewell->id,   'name' => 'Wall Clock',             'stock' => 100, 'price' => 24.99,  'reorder_threshold' => 8]),
            Product::create(['id_category' => $sports->id,    'id_provider' => $activegear->id, 'name' => 'Yoga Mat',               'stock' => 250, 'price' => 22.99,  'reorder_threshold' => 15]),
            Product::create(['id_category' => $sports->id,    'id_provider' => $activegear->id, 'name' => 'Adjustable Dumbbells',   'stock' => 80,  'price' => 89.99,  'reorder_threshold' => 5]),
            Product::create(['id_category' => $sports->id,    'id_provider' => $activegear->id, 'name' => 'Running Shoes',          'stock' => 180, 'price' => 64.99,  'reorder_threshold' => 12]),
            Product::create(['id_category' => $beauty->id,    'id_provider' => $purelux->id,    'name' => 'Vitamin C Serum',        'stock' => 400, 'price' => 18.99,  'reorder_threshold' => 25]),
            Product::create(['id_category' => $beauty->id,    'id_provider' => $purelux->id,    'name' => 'Electric Toothbrush',    'stock' => 120, 'price' => 49.99,  'reorder_threshold' => 8]),
            Product::create(['id_category' => $beauty->id,    'id_provider' => $purelux->id,    'name' => 'Hair Dryer',             'stock' => 90,  'price' => 39.99,  'reorder_threshold' => 6]),
            Product::create(['id_category' => $stationery->id,'id_provider' => $deskco->id,     'name' => 'Notebook Pack (3pcs)',   'stock' => 500, 'price' => 9.99,   'reorder_threshold' => 40]),
            Product::create(['id_category' => $stationery->id,'id_provider' => $deskco->id,     'name' => 'Gel Pen Set',            'stock' => 600, 'price' => 6.99,   'reorder_threshold' => 50]),
            Product::create(['id_category' => $stationery->id,'id_provider' => $deskco->id,     'name' => 'Desk Organizer',         'stock' => 150, 'price' => 17.99,  'reorder_threshold' => 10]),
            Product::create(['id_category' => $pet->id,       'id_provider' => $petplanet->id,  'name' => 'Dog Chew Toy',           'stock' => 300, 'price' => 12.99,  'reorder_threshold' => 20]),
            Product::create(['id_category' => $pet->id,       'id_provider' => $petplanet->id,  'name' => 'Cat Litter Box',         'stock' => 100, 'price' => 27.99,  'reorder_threshold' => 8]),
            Product::create(['id_category' => $pet->id,       'id_provider' => $petplanet->id,  'name' => 'Pet Carrier Bag',        'stock' => 80,  'price' => 44.99,  'reorder_threshold' => 6]),
        ];

        // Generate orders spread across the last 6 months
        $startDate = now()->subMonths(6)->startOfDay();
        $endDate   = now()->endOfDay();
        $totalDays = $startDate->diffInDays($endDate);

        for ($day = 0; $day <= $totalDays; $day++) {
            $date = $startDate->copy()->addDays($day);
            $ordersToday = rand(1, 4);

            for ($i = 0; $i < $ordersToday; $i++) {
                $product = $products[array_rand($products)];
                $amount  = rand(1, 8);

                if ($product->stock < $amount) {
                    continue;
                }

                $timestamp = $date->copy()->addHours(rand(8, 19))->addMinutes(rand(0, 59));

                Order::create([
                    'id_product' => $product->id,
                    'amount'     => $amount,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);

                $product->decrement('stock', $amount);
                $product->refresh();
            }
        }
    }
}