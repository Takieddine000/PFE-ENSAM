<?php
namespace App\Http\Controllers;
use App\Models\Provider;
use Illuminate\Http\Request;
use App\Models\ActivityLog;


class ProviderController extends Controller {
    public function index() {
    return Provider::withCount('products')->get();
}

    public function store(Request $request) {
        $data = $request->validate(['name' => 'required|string']);
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'created',   // or 'updated', 'deleted'
            'details' => 'Provider "' . $data['name'] . '" created',
        ]);
        return Provider::create($data);
    }

    public function update(Request $request, Provider $provider) {
        $data = $request->validate(['name' => 'required|string']);
        $provider->update($data);
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',   // or 'updated', 'deleted'
            'details' => 'Provider "' . $data['name'] . '" updated',
        ]);
        return $provider;
    }

    public function destroy(Request $request, Provider $provider) {
        $provider->delete();
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'deleted',   // or 'updated', 'deleted'
            'details' => 'Provider "' . $request->user()->name . '" deleted',
        ]);
        return response()->noContent();
    }
}