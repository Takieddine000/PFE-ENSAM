<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['id_category', 'id_provider', 'name', 'stock', 'price', 'image'];
    public function category() { return $this->belongsTo(Category::class, 'id_category'); }
    public function provider() { return $this->belongsTo(Provider::class, 'id_provider'); }
    public function orders() {
    return $this->hasMany(Order::class, 'id_product');
}
}
