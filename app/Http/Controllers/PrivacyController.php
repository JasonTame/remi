<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PrivacyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('privacy');
    }
}
