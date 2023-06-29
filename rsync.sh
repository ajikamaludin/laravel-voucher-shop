#!/bin/bash
npm run build

rsync -arP -e 'ssh -p 225' --exclude=node_modules  --exclude=public/uploads --exclude=database/database.sqlite --exclude=.git --exclude=.env --exclude=public/hot . arm@ajikamaludin.id:/home/arm/projects/www/voucher

ssh -p 225 arm@ajikamaludin.id -C docker exec php82 php /var/www/voucher/artisan migrate:refresh --seed
