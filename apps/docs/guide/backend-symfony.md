# Symfony

## Installation

Via a package manager:

```bash
composer require herytz/rcu-bundle
```

## Configuration

Everything works directly with the default configuration below. If you want to customize the configuration, you need to create the `config/packages/rcu.yaml` file and put your custom configuration inside it.

::: code-group

```yaml [config/packages/rcu.yaml]
rcu:
  upload_status_path: "/uploadStatus"
  upload_path: "/upload"
  tmp_dir: "%kernel.project_dir%/tmp/chunks"
  output_dir: "%kernel.project_dir%/tmp/output"
  json_store_dir: "%kernel.project_dir%/tmp/store"
```

:::

::: details

### upload_status_path

- Type: `string`
- Default: `/uploadStatus`

Path to retrieve the upload status.

### upload_path

- Type: `string`
- Default: `/upload`

Path to upload all chunks.

### tmp_dir

- Type: `string`
- Default: `%kernel.project_dir%/tmp/chunks`

Directory to save all binary chunks.

### output_dir

- Type: `string`
- Default: `%kernel.project_dir%/tmp/output`

Directory to save the complete file.

### json_store_dir

- Type: `string`
- Default: `%kernel.project_dir%/tmp/store`

Directory use by [JSON store](#store) to save all upload info data.

:::

## Store

The `store` is used to save information about the upload, such as the number of the last uploaded chunk, the total number of chunks, etc. The default store is [JSON](https://github.com/heryTz/rcu-symfony/blob/main/src/StoreProvider/JsonStoreProvider.php).

You can create your own store provider by following this guide:

- Create a class that implement [StoreProviderInterface](https://github.com/heryTz/rcu-symfony/blob/main/src/Contract/StoreProviderInterface.php):

::: code-group

```php [src/StoreProvider/CustomStoreProvider.php]
<?php

namespace App\StoreProvider;

use Herytz\RcuBundle\Contract\StoreProviderInterface;

class CustomStoreProvider implements StoreProviderInterface
{
  // Implement all method
}
```

:::

- Update `config/services.yaml`

::: code-group

```yaml [config/services.yaml]
services:
  # Add these lines
  Herytz\RcuBundle\Contract\StoreProviderInterface:
    class: App\StoreProvider\CustomStoreProvider
```

:::

## On Completed

You can perform any additional actions or operations after the upload is completed, such as updating a database record or sending a notification.

- Create a class that implement [OnCompletedInterface](https://github.com/heryTz/rcu-symfony/blob/main/src/Contract/OnCompletedInterface.php)

::: code-group

```php [src/Handler/OnCompletedHandler.php]
<?php

namespace App\Handler;

use Herytz\RcuBundle\Contract\OnCompletedInterface;

class OnCompletedHandler implements OnCompletedInterface
{
  // Implement all method
}
```

:::

- Update `config/services.yaml`

::: code-group

```yaml [config/services.yaml]
services:
  # Add these lines
  Herytz\RcuBundle\Contract\OnCompletedInterface:
    class: App\Handler\OnCompletedHandler
```

:::

## Source

- [GitHub](https://github.com/heryTz/rcu-symfony)
