<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Product;
use App\Models\Order;
use App\Models\ActivityLog;
use App\Models\Notification;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@stock.com'],
            [
                'name'         => 'Admin',
                'password'     => bcrypt('password'),
                'role'         => 'admin',
                'is_protected' => true,
            ]
        );

        $alice = User::create([
            'name'     => 'Alice Martin',
            'email'    => 'alice@stock.com',
            'password' => bcrypt('password'),
            'role'     => 'employee',
        ]);

        $bob = User::create([
            'name'     => 'Bob Johnson',
            'email'    => 'bob@stock.com',
            'password' => bcrypt('password'),
            'role'     => 'employee',
        ]);

        // ── Categories ─────────────────────────────────────────
        $electronics = Category::create(['name' => 'Électronique',     'description' => 'Appareils et gadgets électroniques']);
        $furniture   = Category::create(['name' => 'Mobilier',         'description' => 'Meubles de bureau et maison']);
        $clothing    = Category::create(['name' => 'Vêtements',        'description' => 'Habillement et accessoires']);
        $food        = Category::create(['name' => 'Alimentation',     'description' => 'Produits alimentaires et boissons']);
        $tools       = Category::create(['name' => 'Outillage',        'description' => 'Outils et équipements']);
        $sports      = Category::create(['name' => 'Sport & Loisirs',  'description' => 'Équipements sportifs et de loisirs']);
        $beauty      = Category::create(['name' => 'Beauté & Santé',   'description' => 'Soins personnels et santé']);
        $stationery  = Category::create(['name' => 'Papeterie',        'description' => 'Fournitures de bureau et scolaires']);

        // ── Providers ──────────────────────────────────────────
        $techcorp   = Provider::create(['name' => 'TechCorp']);
        $furnimax   = Provider::create(['name' => 'FurniMax']);
        $styleplus  = Provider::create(['name' => 'StylePlus']);
        $freshmart  = Provider::create(['name' => 'FreshMart']);
        $buildpro   = Provider::create(['name' => 'BuildPro']);
        $activegear = Provider::create(['name' => 'ActiveGear']);
        $purelux    = Provider::create(['name' => 'PureLux']);
        $deskco     = Provider::create(['name' => 'DeskCo']);

        // ── Products ───────────────────────────────────────────
        $products = [
            Product::create(['id_category' => $electronics->id, 'id_provider' => $techcorp->id,   'name' => 'Laptop Pro 15',        'stock' => 25,  'price' => 1299.99, 'reorder_threshold' => 5]),
            Product::create(['id_category' => $electronics->id, 'id_provider' => $techcorp->id,   'name' => 'Souris Sans Fil',      'stock' => 120, 'price' => 29.99,   'reorder_threshold' => 15]),
            Product::create(['id_category' => $electronics->id, 'id_provider' => $techcorp->id,   'name' => 'Clavier Mécanique',    'stock' => 3,   'price' => 89.99,   'reorder_threshold' => 5]),
            Product::create(['id_category' => $electronics->id, 'id_provider' => $techcorp->id,   'name' => 'Écran 4K 27"',         'stock' => 15,  'price' => 499.99,  'reorder_threshold' => 5]),
            Product::create(['id_category' => $electronics->id, 'id_provider' => $techcorp->id,   'name' => 'Hub USB-C 7 ports',    'stock' => 60,  'price' => 45.00,   'reorder_threshold' => 10]),
            Product::create(['id_category' => $furniture->id,   'id_provider' => $furnimax->id,   'name' => 'Chaise Ergonomique',   'stock' => 10,  'price' => 349.00,  'reorder_threshold' => 3]),
            Product::create(['id_category' => $furniture->id,   'id_provider' => $furnimax->id,   'name' => 'Bureau Réglable',      'stock' => 2,   'price' => 599.00,  'reorder_threshold' => 3]),
            Product::create(['id_category' => $furniture->id,   'id_provider' => $furnimax->id,   'name' => 'Bibliothèque 5 cases', 'stock' => 18,  'price' => 129.00,  'reorder_threshold' => 5]),
            Product::create(['id_category' => $clothing->id,    'id_provider' => $styleplus->id,  'name' => 'Polo de Travail',      'stock' => 80,  'price' => 24.99,   'reorder_threshold' => 20]),
            Product::create(['id_category' => $clothing->id,    'id_provider' => $styleplus->id,  'name' => 'Pantalon Slim',        'stock' => 4,   'price' => 49.99,   'reorder_threshold' => 5]),
            Product::create(['id_category' => $clothing->id,    'id_provider' => $styleplus->id,  'name' => 'Sweat à Capuche',      'stock' => 35,  'price' => 39.99,   'reorder_threshold' => 10]),
            Product::create(['id_category' => $food->id,        'id_provider' => $freshmart->id,  'name' => 'Eau Minérale 24x50cl', 'stock' => 200, 'price' => 8.99,    'reorder_threshold' => 30]),
            Product::create(['id_category' => $food->id,        'id_provider' => $freshmart->id,  'name' => 'Café en Grains 1kg',   'stock' => 50,  'price' => 18.50,   'reorder_threshold' => 10]),
            Product::create(['id_category' => $food->id,        'id_provider' => $freshmart->id,  'name' => 'Assortiment Snacks',   'stock' => 1,   'price' => 35.00,   'reorder_threshold' => 5]),
            Product::create(['id_category' => $tools->id,       'id_provider' => $buildpro->id,   'name' => 'Perceuse Sans Fil',    'stock' => 12,  'price' => 129.99,  'reorder_threshold' => 3]),
            Product::create(['id_category' => $tools->id,       'id_provider' => $buildpro->id,   'name' => 'Coffret Outils 42pcs', 'stock' => 20,  'price' => 79.99,   'reorder_threshold' => 5]),
            Product::create(['id_category' => $sports->id,      'id_provider' => $activegear->id, 'name' => 'Tapis de Yoga',        'stock' => 45,  'price' => 22.99,   'reorder_threshold' => 10]),
            Product::create(['id_category' => $sports->id,      'id_provider' => $activegear->id, 'name' => 'Haltères Réglables',   'stock' => 8,   'price' => 89.99,   'reorder_threshold' => 3]),
            Product::create(['id_category' => $sports->id,      'id_provider' => $activegear->id, 'name' => 'Chaussures Running',   'stock' => 30,  'price' => 64.99,   'reorder_threshold' => 8]),
            Product::create(['id_category' => $beauty->id,      'id_provider' => $purelux->id,    'name' => 'Sérum Vitamine C',     'stock' => 75,  'price' => 18.99,   'reorder_threshold' => 15]),
            Product::create(['id_category' => $beauty->id,      'id_provider' => $purelux->id,    'name' => 'Brosse à Dents Élec.', 'stock' => 22,  'price' => 49.99,   'reorder_threshold' => 5]),
            Product::create(['id_category' => $stationery->id,  'id_provider' => $deskco->id,     'name' => 'Pack Cahiers x3',      'stock' => 150, 'price' => 9.99,    'reorder_threshold' => 30]),
            Product::create(['id_category' => $stationery->id,  'id_provider' => $deskco->id,     'name' => 'Stylos Gel x10',       'stock' => 200, 'price' => 6.99,    'reorder_threshold' => 40]),
            Product::create(['id_category' => $stationery->id,  'id_provider' => $deskco->id,     'name' => 'Organiseur de Bureau', 'stock' => 33,  'price' => 17.99,   'reorder_threshold' => 8]),
        ];

        // ── Orders — spread over last 6 months ─────────────────
        $users   = [$admin, $alice, $bob];
        $statuses = ['pending', 'confirmed', 'confirmed', 'confirmed']; // more confirmed than pending

        $startDate = now()->subMonths(6)->startOfDay();
        $totalDays = $startDate->diffInDays(now());

        $orderRecords = [];

        for ($day = 0; $day <= $totalDays; $day++) {
            $date        = $startDate->copy()->addDays($day);
            $ordersToday = rand(1, 5);

            for ($i = 0; $i < $ordersToday; $i++) {
                $product = $products[array_rand($products)];
                $amount  = rand(1, 6);
                $status  = $statuses[array_rand($statuses)];

                if ($product->stock < $amount) continue;

                $timestamp = $date->copy()->addHours(rand(8, 18))->addMinutes(rand(0, 59));

                $order = Order::create([
                    'id_product' => $product->id,
                    'amount'     => $amount,
                    'status'     => $status,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);

                $product->decrement('stock', $amount);
                $product->refresh();

                $orderRecords[] = [
                    'order'   => $order,
                    'product' => $product,
                    'user'    => $users[array_rand($users)],
                    'date'    => $timestamp,
                ];
            }
        }

        // ── Activity Logs ──────────────────────────────────────
        $logEntries = [
            ['user' => $admin, 'action' => 'created', 'details' => 'Catégorie "Électronique" créée',       'days' => 30],
            ['user' => $admin, 'action' => 'created', 'details' => 'Catégorie "Mobilier" créée',           'days' => 30],
            ['user' => $admin, 'action' => 'created', 'details' => 'Fournisseur "TechCorp" créé',          'days' => 29],
            ['user' => $admin, 'action' => 'created', 'details' => 'Produit "Laptop Pro 15" créé',         'days' => 28],
            ['user' => $admin, 'action' => 'created', 'details' => 'Produit "Écran 4K 27"" créé',          'days' => 28],
            ['user' => $alice, 'action' => 'created', 'details' => 'Commande pour "Souris Sans Fil"',      'days' => 20],
            ['user' => $alice, 'action' => 'created', 'details' => 'Commande pour "Clavier Mécanique"',    'days' => 18],
            ['user' => $admin, 'action' => 'updated', 'details' => 'Produit "Laptop Pro 15" mis à jour',   'days' => 15],
            ['user' => $bob,   'action' => 'created', 'details' => 'Commande pour "Café en Grains 1kg"',   'days' => 10],
            ['user' => $bob,   'action' => 'created', 'details' => 'Commande pour "Sweat à Capuche"',      'days' => 8],
            ['user' => $admin, 'action' => 'updated', 'details' => 'Catégorie "Vêtements" mise à jour',    'days' => 5],
            ['user' => $admin, 'action' => 'deleted', 'details' => 'Fournisseur "AncienFournisseur" supprimé', 'days' => 3],
            ['user' => $alice, 'action' => 'created', 'details' => 'Commande pour "Tapis de Yoga"',        'days' => 2],
            ['user' => $bob,   'action' => 'updated', 'details' => 'Commande #12 confirmée',               'days' => 1],
            ['user' => $admin, 'action' => 'created', 'details' => 'Produit "Sérum Vitamine C" créé',      'days' => 0],
        ];

        foreach ($logEntries as $entry) {
            $ts = now()->subDays($entry['days']);
            ActivityLog::create([
                'user_id'    => $entry['user']->id,
                'action'     => $entry['action'],
                'details'    => $entry['details'],
                'created_at' => $ts,
                'updated_at' => $ts,
            ]);
        }

        // ── Notifications ──────────────────────────────────────
        $notifications = [
            ['type' => 'low_stock',    'title' => 'Stock Faible',      'message' => '"Clavier Mécanique" est en stock faible (3 restants)',   'read' => false, 'days' => 2],
            ['type' => 'low_stock',    'title' => 'Stock Faible',      'message' => '"Bureau Réglable" est en stock faible (2 restants)',     'read' => false, 'days' => 1],
            ['type' => 'low_stock',    'title' => 'Stock Faible',      'message' => '"Assortiment Snacks" est en stock faible (1 restant)',   'read' => false, 'days' => 0],
            ['type' => 'order_placed', 'title' => 'Nouvelle Commande', 'message' => 'Commande passée pour "Laptop Pro 15" (qté: 2)',          'read' => true,  'days' => 5],
            ['type' => 'order_placed', 'title' => 'Nouvelle Commande', 'message' => 'Commande passée pour "Chaise Ergonomique" (qté: 1)',     'read' => true,  'days' => 4],
            ['type' => 'order_placed', 'title' => 'Nouvelle Commande', 'message' => 'Commande passée pour "Café en Grains 1kg" (qté: 5)',    'read' => true,  'days' => 3],
            ['type' => 'low_stock',    'title' => 'Stock Faible',      'message' => '"Pantalon Slim" est en stock faible (4 restants)',       'read' => true,  'days' => 7],
            ['type' => 'order_placed', 'title' => 'Nouvelle Commande', 'message' => 'Commande passée pour "Tapis de Yoga" (qté: 3)',         'read' => true,  'days' => 6],
        ];

        foreach ($notifications as $n) {
            $ts = now()->subDays($n['days']);
            Notification::create([
                'type'       => $n['type'],
                'title'      => $n['title'],
                'message'    => $n['message'],
                'read'       => $n['read'],
                'created_at' => $ts,
                'updated_at' => $ts,
            ]);
        }
    }
}