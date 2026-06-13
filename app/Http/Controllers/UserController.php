<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller {

    public function index() {
        return User::select('id', 'name', 'email', 'role', 'is_protected', 'created_at')->get();
    }

    public function update(Request $request, User $user) {
        $request->validate(['role' => 'required|in:admin,employee']);

        if ($user->is_protected) {
            return response()->json(['message' => 'This account is protected.'], 403);
        }

        $user->update(['role' => $request->role]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',
            'details' => 'User "' . $user->name . '" role changed to ' . $request->role,
        ]);

        return $user;
    }

    public function updateInfo(Request $request, User $user) {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user->name  = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',
            'details' => 'User "' . $user->name . '" info updated',
        ]);

        return $user;
    }

    public function updateProfile(Request $request) {
        $user = $request->user();

        $request->validate([
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email,' . $user->id,
            'current_password' => 'required',
            'password'         => 'nullable|confirmed|min:8',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $oldName     = $user->name;
        $user->name  = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'action'  => 'updated',
            'details' => 'User "' . $oldName . '" updated their profile',
        ]);

        return $user;
    }

    public function destroy(Request $request, User $user) {
        if ($user->is_protected) {
            return response()->json(['message' => 'Cannot delete the main admin account.'], 403);
        }

        $name = $user->name;
        $user->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'deleted',
            'details' => 'User "' . $name . '" deleted',
        ]);

        return response()->noContent();
    }
}