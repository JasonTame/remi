<?php

it('displays the terms of service page', function () {
    $response = $this->get('/terms');

    $response->assertSuccessful();
});

it('has the correct terms route name', function () {
    expect(route('terms'))->toBe(url('/terms'));
});
