<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Product;
use App\Models\Order;
use App\Models\ActivityLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'         => 'Admin',
            'email'        => 'admin@stock.com',
            'password'     => bcrypt('password'),
            'role'         => 'admin',
            'is_protected' => true,
        ]);
    }
}