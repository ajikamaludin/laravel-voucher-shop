# Voucher App

This online shop to purchase wifi voucher for WISP/Small ISP Based

## Support me

<a href="https://trakteer.id/ajikamaludin" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-blue-2.png" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

## Requirements

-   PHP 8.1 or latest
-   Node 16+ or latest

## How to run

```bash
cp .env.example .env # configure app for laravel
touch database/database.sqlite # if you use .env.example with default sqlite database
composer install
npm install
npm run dev # compiling asset for development
```

## Default User

```bash
username : admin@admin.com
password : password
```

## Compile Assets ( to prod )

```bash
npm run build
```

### Register Scheduler

```bash
crontab -e
* * * * * cd /home/arm/projects/www/voucher && php artisan schedule:run >> /dev/null 2>&1
```

## Other

### v1

```bash
rsync -arP -e 'ssh -p 224' --exclude=node_modules --exclude=.git --exclude=.env --exclude=storage --exclude=public/hot . arm@ajikamaludin.id:/home/arm/projects/voucher

rsync -arP -e 'ssh -p 224' --exclude=node_modules --exclude=database/database.sqlite --exclude=.git --exclude=.env --exclude=storage --exclude=public/hot . arm@ajikamaludin.id:/home/arm/projects/voucher
```

### v2

```bash
rsync -arP -e 'ssh -p 225' --exclude=node_modules --exclude=database/database.sqlite --exclude=.git --exclude=.env --exclude=public/hot . arm@ajikamaludin.id:/home/arm/projects/www/voucher

ssh -p 225 arm@ajikamaludin.id -C docker exec php82 php /var/www/voucher/artisan migrate:refresh --seed
```
