<?php

use Illuminate\Support\Facades\File;

test('manifest.json exists and is valid', function () {
    $manifestPath = public_path('manifest.json');

    expect(File::exists($manifestPath))->toBeTrue();

    $manifestContent = File::get($manifestPath);
    $manifest = json_decode($manifestContent, true);

    expect($manifest)->not->toBeNull();
    expect($manifest)->toHaveKeys(['name', 'short_name', 'start_url', 'display', 'icons']);
});

test('manifest.json has correct structure and values', function () {
    $manifestPath = public_path('manifest.json');
    $manifestContent = File::get($manifestPath);
    $manifest = json_decode($manifestContent, true);

    expect($manifest['name'])->toBe('Remi');
    expect($manifest['short_name'])->toBe('Remi');
    expect($manifest['display'])->toBe('standalone');
    expect($manifest['start_url'])->toBe('/');
    expect($manifest['icons'])->toBeArray();
    expect(count($manifest['icons']))->toBeGreaterThan(0);
    expect($manifest['shortcuts'])->toBeArray();
    expect($manifest['screenshots'])->toBeArray();
});

test('required PWA icons exist', function () {
    expect(File::exists(public_path('icon-512.png')))->toBeTrue();
    expect(File::exists(public_path('icon-180.png')))->toBeTrue();
    expect(File::exists(public_path('icon-96.png')))->toBeTrue();
});

test('PWA screenshots exist', function () {
    expect(File::exists(public_path('screenshot-desktop.png')))->toBeTrue();
    expect(File::exists(public_path('screenshot-mobile.png')))->toBeTrue();
});

test('landing page contains PWA meta tags', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertSee('<link rel="manifest" href="/manifest.json">', false);
    $response->assertSee('<meta name="theme-color"', false);
    $response->assertSee('<meta name="mobile-web-app-capable"', false);
    $response->assertSee('<meta name="apple-mobile-web-app-capable"', false);
});

test('authenticated pages contain PWA meta tags', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
    $response->assertSee('<link rel="manifest" href="/manifest.json">', false);
    $response->assertSee('<meta name="theme-color"', false);
});
