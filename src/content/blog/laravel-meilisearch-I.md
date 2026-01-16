---
title: "Laravel & Meilisearch: Vector Search 101"
description: "Here a simple guide 101 on how to do vector search with Meilisearch"
pubDate: "Jan 12 2025"
heroImage: "/blog-placeholder-1.jpg"
tag: "laravel"
---

Some few months back I had the chance to be the Senior Developer Engineer of an upcoming AI solution called M2Local, this application is an AI Solution for Real Estate where promotors, agents and customer could have a smarter experiencie when it's related to working with properties: 

- Looking for best prices.
- Finding the most accurate properties according to your specifications.
- Making price and condition reports by areas for agents, customers or owners

I was in charge of the system design in arch and database and when I started I focused on the DB structure and finally the RAG (Retrieval-Augmented Generation) strategy, one of our initial question was: 

Which Vector Database are we going to use? 

We've previously tried PostgreSQL with the extension PGvector but we decided to try something else, so we went with Meilisearch. 

This articles is going to demonstrate you how you can set it up really fast in your Laravel app using Laravel Scout.

# Requirements
- PHP 8.0+
- Meilisearch (locally or cloud access)
- Laravel Scout

# Setup
I won't drag you into a long article so continuing where we left of. Let's say we have a model for the properties and we want to store data in a vector database because we want to have a smart AI Chat agent that can read and work with our stored properties. It can sounds hard but actually the Laravel team has already done a really awesome driver package already.

## Laravel Scout
This first-party package is a driver solution for full-text search for Eloquent models.

>Is it mandatory to use Laravel Scout? 

Not really, you can do your own driver to connect with your service and perform the full-text search. We want to take advantage of the package because it already has the utilities to work with this full text databases (Algolia, Meilisearch, Typesense, MySQL and PostgreSQL), meaning that you'll have the same API for any of those databases. You can find the official [documentation for Laravel Scout here](https://laravel.com/docs/12.x/scout#introduction).

To install Laravel Scout in your project use the following command:

```bash
composer require laravel/scout
```

We're going to need the configuration file, for that, use this command:

```bash
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

Finally, we're adding the `Laravel\Scout\Searchable` trait in the `Property` model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Property extends Model
{
    use Searchable;
}
```

And that's it, our model is already searchable! some quick notes for the trait that you should aware of at this point:

- It adds a model observer that will automatically keep the model in sync with the search driver: It means that when we do something like `Property::create(...)` it'll sync with the database.
- It affects model methods as `create()`, `delete()`, `update()`, `save()`. 
- It´s possible to delay the sync if you need to do other operations before saving the records.
- It adds the method `search()` to your model class, this is the one we want for full text search.

## Indexes, documents and attributes

If it's your first time working with this databases, you usually need to define an index setting with the structure for the documents and their attributes, for simplicity, let's compare the terms with the one from relational databases:

```
Index = Table
Document = Record
Attribute = Column
```

It worked for me, I hope it works for you too.

To define the index we're going to modify the `scout.php` config file, in this file you'll find the drivers configuration, locate the key for `meilisearch` and you'll find the `index-settings` key inside of the array:

```php
<?php
[
	'meilisearch' => [
		'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
		'key' => env('MEILISEARCH_KEY'),
		'index-settings' => [
			App\Models\Property::class => [
				'filterableAttributes' => [
					'id',
					'operation',
					'property_type',
					'bedrooms',
					'price',
					'city_name',
				],
			],
		],
	]
]
```

If you want to define which attributes are going to be sortable you can add the following key inside the `index-settings`, let's make the property **price** to be sortable:

```php
<?php
[
	'meilisearch' => [
		'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
		'key' => env('MEILISEARCH_KEY'),
		'index-settings' => [
			App\Models\Property::class => [
				'filterableAttributes' => [
					'id',
					'operation',
					'property_type',
					'bedrooms',
					'price',
					'city_name',
				],
				'sortableAttributes' => [
					'price',
				],
			],
		],
	]
]
```

## Embedding
