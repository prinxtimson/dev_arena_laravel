<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Resource;
use App\Models\User;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $resources = Resource::with('media')->get();

        return $resources;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $user = auth()->user();

        $resource = $user->resources()->create($request->except('files'));

        if ($request->hasFile('files')) {
            $resource->addMultipleMediaFromRequest(['files'])
                    ->each(function ($file) {
                        $file->toMediaCollection();
                    });
        }

        $response = [
            'resource' => $resource->load('media'),
            'msg' => 'Resource uploaded successfully.'
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Resource::find($id)->load('media');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $resource = Resource::find($id);
        $resource->update($request->except('files'));

        if ($request->hasFile('files')) {
            $resource->addMultipleMediaFromRequest(['files'])
                    ->each(function ($file) {
                        $file->toMediaCollection();
                    });
        }

        $response = [
            'resource' => $resource->load('media'),
            'msg' => 'Resource updated successfully.'
        ];

        return response($response, 200);
    }

    public function remove_file(Request $request, $id, $index)
    {
        $resource = Resource::find($id);

        $mediaItems = $resource->getMedia();

        $mediaItems[$index]->delete();

        return $resource->refresh()->load('media');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Resource::destroy($id);
    }
}
