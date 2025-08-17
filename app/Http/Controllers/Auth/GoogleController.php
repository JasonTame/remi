<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->id)->first();
            if ($user) {
                Auth::login($user);

                return redirect()->intended(route('dashboard'));
            }

            $existingUser = User::where('email', $googleUser->email)->first();
            if ($existingUser) {
                // Link Google account to existing user
                $existingUser->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                ]);

                Auth::login($existingUser);

                return redirect()->intended(route('dashboard'));
            }

            $newUser = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar,
                'email_verified_at' => now(),
                'onboarding_completed' => false,
            ]);

            Auth::login($newUser);

            return redirect()->route('onboarding');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Unable to login using Google. Please try again.');
        }
    }
}
