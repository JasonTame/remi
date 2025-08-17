<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class TermsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('terms');
    }
}
