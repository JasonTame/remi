<?php

it('displays the privacy policy page', function () {
    $response = $this->get('/privacy');

    $response->assertSuccessful();
});

it('has the correct privacy policy route name', function () {
    expect(route('privacy'))->toBe(url('/privacy'));
});
