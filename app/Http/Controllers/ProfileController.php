<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ActivityLog;


class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        ActivityLog::create([
        'user_id' => $request->user()->id,
        'action'  => 'created',   // or 'updated', 'deleted'
        'details' => 'Profile "' . $request->user()->name . '" created',
    ]);
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'updated',   // or 'updated', 'deleted'
            'details' => 'Profile "' . $request->user()->name . '" updated',
        ]);

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action'  => 'deleted',   // or 'updated', 'deleted'
            'details' => 'Profile "' . $request->user()->name . '" deleted',
        ]);

        return Redirect::to('/');
    }
}
