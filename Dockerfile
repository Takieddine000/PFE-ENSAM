FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev \
    libxml2-dev libzip-dev default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring zip gd

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

CMD ["sh", "-c", "\
    php artisan config:clear && \
    php artisan migrate --force && \
    php artisan storage:link 2>/dev/null || true && \
    php artisan serve --host=0.0.0.0 --port=8000 \
"]