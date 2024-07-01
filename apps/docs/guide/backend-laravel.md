# Laravel

## Installation

Via composer :

```bash
composer require heryfitiavana/rcu-laravel
```

## Usage

### Defining Routes

Add the following routes to your `routes/web.php` file:

```php
use Heryfitiavana\RCU\Controllers\UploadController;

Route::get('/uploadStatus', [UploadController::class, 'uploadStatus']);
Route::post('/upload', [UploadController::class, 'upload']);

```

Default RCU configuration : [RCUConfig](#rcuconfig)

::: details Customize the RCU configuration

### Custom configuration

You can customize the package's behavior by defining a custom configuration array. Here's an example:

```php
$customConfig = [
    "store" => new JsonStoreProvider('rcu/uploads.json'),
    "tmpDir" => "rcu/tmp",
    "outputDir" => "rcu/output",
    "onCompleted" => function ($data) {
    },
];
```

### Use the configuration

Go to `app/Providers/AppServiceProvider.php` and add the following code

```php{3-5,12-21}

use Illuminate\Support\ServiceProvider;
use Heryfitiavana\RCU\Controllers\RCUControllerFactory;
use Heryfitiavana\RCU\Controllers\UploadController;
use Heryfitiavana\RCU\StoreProviders\JsonStoreProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // other ...
        $this->app->singleton(UploadController::class, function ($app) {
            $customConfig = [
                "store" => new JsonStoreProvider('rcu/uploads.json'),
                "tmpDir" => "rcu/tmp",
                "outputDir" => "rcu/output",
                "onCompleted" => function ($data) {
                },
            ];
            return RCUControllerFactory::createController($customConfig);
        });
    }

    public function boot()
    {
    }
}
```

:::

## API

### RCUConfig <Badge type="info" text="array" />

```php
[
    "store" => new JsonStoreProvider('rcu/uploads.json'),
    "tmpDir" => "rcu/tmp",
    "outputDir" => "rcu/output",
    "onCompleted" => function ($data) {
    },
]
```

#### store

- Type: `StoreProviderInterface`
- Default: `JsonStoreProvider`

The `store` parameter is used to store information about the upload, such as the number of the last uploaded chunk, the total number of chunks, etc. The default store is JSON, but you can implement your own by implementing the [StoreProviderInterface](#storeproviderinterface).

#### tmpDir

- Type: `string`
- Default: `rcu/tmp`

Directory to save all binary chunks.

#### outputDir

- Type: `string`
- Default: `rcu/output`

Directory to save the complete file.

#### onCompleted

- Type: `(data: ['outputFile' => string, 'fileId' => string]) => void`

This callback function can be used to perform any additional actions or operations after the upload is completed, such as updating a database record or sending a notification.

- `outputFile`: Path of the uploaded file.
- `fileId`: The ID of the file used to identify the upload. This is specified from [frontend](/guide/frontend-api#setfileid).

### StoreProviderInterface <Badge type="info" text="interface" />

```php
Upload = [
    "id" => string,
    "chunkCount" => int,
    "lastUploadedChunkNumber": int,
    "chunkFilenames": string[],
];

interface StoreProviderInterface
{
    public function getItem(String $id) : Upload | undefined;
    public function createItem(String $id, Int $chunkCount): Upload;
    public function updateItem(String $id, Upload $update) : Upload;
    public function removeItem(String $id) : void;
}

```
