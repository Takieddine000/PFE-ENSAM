<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    protected $fillable = ['id_product', 'amount', 'status'];
    public function product() { return $this->belongsTo(Product::class, 'id_product'); }
}
