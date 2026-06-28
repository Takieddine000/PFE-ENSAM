#!/bin/sh

rm -f /var/www/public/hot

mkdir -p \
    /var/www/storage/framework/cache \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/framework/testing \
    /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "Waiting for database..."
until php -r "new PDO('mysql:host=db;port=3306;dbname=stock_app', 'stockuser', 'stockpass');" >/dev/null 2>&1
do
    echo "Database not ready, retrying in 3s..."
    sleep 3
done

echo "Database ready!"

# Run migrations first
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Create storage symlink
php artisan storage:link 2>/dev/null || true

echo "Starting server..."
exec php artisan serve --host=0.0.0.0 --port=8000