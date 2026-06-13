<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class AdminOnly {
    public function handle(Request $request, Closure $next) {
    $user = $request->user();

    if (!$user || $user->role !== 'admin') {
        return response()->json([
            'message' => 'Forbidden',
            'your_role' => $user?->role,
            'user' => $user?->email,
        ], 403);
    }

    return $next($request);
}
}