export interface CodeSnippet {
  title: string;
  language: string;
  filename: string;
  code: string;
}

export const codeSnippets: Record<string, CodeSnippet[]> = {
  laravel: [
    {
      title: "Laravel Database Migrations (MySQL)",
      language: "php",
      filename: "database/migrations/2026_06_30_all_erp_tables.php",
      code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class CreateDistroHubEnterpriseTables extends Migration
{
    public function up()
    {
        // 1. Companies & Distributions
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('status', ['Active', 'Suspended'])->default('Active');
            $table->timestamps();
        });

        // 2. Users (Central User Management)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('login_id')->unique(); // e.g. OB-0001, SM-0001
            $table->string('name');
            $table->string('password');
            $table->string('email')->nullable();
            $table->enum('role', [
                'Super Admin', 'Company Admin', 'Manager', 'Supervisor', 
                'Accountant', 'Warehouse Manager', 'Operations User', 'Order Booker', 'Supply Man'
            ]);
            $table->enum('status', ['Active', 'Deactivated', 'Suspended'])->default('Active');
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->unsignedBigInteger('assigned_route_id')->nullable();
            $table->string('device_uuid')->nullable(); // Device Binding ID
            $table->string('last_ip')->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });

        // 3. License System
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('license_key', 512); // Cryptographically encrypted
            $table->enum('type', ['Trial', 'Monthly', 'Yearly', 'Lifetime']);
            $table->date('activation_date');
            $table->date('expiry_date');
            $table->integer('device_limit')->default(5);
            $table->integer('user_limit')->default(10);
            $table->text('digital_signature');
            $table->enum('status', ['Active', 'Suspended', 'Revoked', 'Expired'])->default('Active');
            $table->timestamps();
        });

        // 4. Routes, Areas & Beats
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Route A
            $table->string('area'); // e.g., North Region
            $table->string('beat_plan'); // e.g., Monday / Thursday Beat
            $table->foreignId('assigned_employee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 5. Shops (Customers)
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->string('shop_name');
            $table->string('owner_name');
            $table->string('mobile')->unique();
            $table->text('address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('geo_radius')->default(50); // in meters
            $table->decimal('credit_limit', 12, 2)->default(0.00);
            $table->decimal('outstanding_balance', 12, 2)->default(0.00);
            $table->foreignId('route_id')->constrained('routes')->onDelete('cascade');
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->timestamps();
        });

        // 6. Orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops');
            $table->foreignId('order_booker_id')->constrained('users');
            $table->decimal('total_amount', 12, 2);
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->timestamps();
        });

        // 7. Inventory Stock
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->string('product_name');
            $table->integer('opening_stock')->default(0);
            $table->integer('purchased')->default(0);
            $table->integer('transferred')->default(0);
            $table->integer('damaged')->default(0);
            $table->integer('expired')->default(0);
            $table->integer('warehouse_stock')->default(0);
            $table->timestamps();
        });

        // 8. Accounts & General Ledgers
        Schema::create('accounts_vouchers', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->enum('type', ['Customer Ledger', 'Cash Book', 'Bank Book', 'Expenses', 'Recovery', 'Journal Vouchers']);
            $table->string('description');
            $table->decimal('debit', 12, 2)->default(0.00);
            $table->decimal('credit', 12, 2)->default(0.00);
            $table->timestamps();
        });

        // 9. Payroll Engine
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('base_salary', 10, 2);
            $table->decimal('fuel_allowance', 10, 2)->default(0);
            $table->decimal('mobile_allowance', 10, 2)->default(0);
            $table->decimal('incentives', 10, 2)->default(0);
            $table->decimal('deductions', 10, 2)->default(0);
            $table->decimal('net_salary', 10, 2);
            $table->enum('status', ['Paid', 'Pending', 'On Hold'])->default('Pending');
            $table->timestamps();
        });

        // 10. Security Audit Trail Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_login_id')->nullable();
            $table->string('action');
            $table->string('module');
            $table->string('ip_address');
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('accounts_vouchers');
        Schema::dropIfExists('inventories');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('shops');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('licenses');
        Schema::dropIfExists('users');
        Schema::dropIfExists('companies');
    }
}`
    },
    {
      title: "Laravel Routes with JWT & Device Binding Middleware",
      language: "php",
      filename: "routes/api.php",
      code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\LicenseController;
use App\\Http\\Controllers\\ShopController;
use App\\Http\\Controllers\\OrderController;
use App\\Http\\Controllers\\RouteController;

/*
|--------------------------------------------------------------------------
| DistroHub Central Control System REST API Routes
|--------------------------------------------------------------------------
*/

// Public Authentication Endpoints
Route::post('auth/login', [AuthController::class, 'login']);

// Protected API Routes - Required JWT, Valid active user and Device Bound Check
Route::group([
    'middleware' => ['api', 'jwt.verify', 'device.bound', 'user.active']
], function () {
    
    // User Management
    Route::post('users', [AuthController::class, 'createUser']);
    Route::put('users/{id}', [AuthController::class, 'updateUser']);
    Route::patch('users/{id}/status', [AuthController::class, 'updateStatus']);
    Route::post('users/{id}/reset-password', [AuthController::class, 'resetPassword']);

    // Cryptographic License Controllers
    Route::post('licenses/generate', [LicenseController::class, 'generate']);
    Route::post('licenses/{id}/renew', [LicenseController::class, 'renew']);
    Route::post('licenses/{id}/suspend', [LicenseController::class, 'suspend']);
    Route::post('licenses/{id}/revoke', [LicenseController::class, 'revoke']);
    Route::get('licenses/export/{id}', [LicenseController::class, 'exportLicenseFile']);

    // Customers (Shops) & SFA Integrations
    Route::get('shops', [ShopController::class, 'index']);
    Route::post('shops', [ShopController::class, 'store']); // Approved shops
    Route::get('shops/induction', [ShopController::class, 'getInductionRequests']);
    Route::post('shops/induction/{id}/approve', [ShopController::class, 'approveInduction']);
    Route::post('shops/induction/{id}/reject', [ShopController::class, 'rejectInduction']);

    // Beats & Routes compliance
    Route::get('routes', [RouteController::class, 'index']);
    Route::post('routes', [RouteController::class, 'store']);
    Route::post('routes/transfer', [RouteController::class, 'transferRoute']);
    Route::post('routes/bulk-transfer', [RouteController::class, 'bulkTransferRoute']);

    // SFA Remote Orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']); // SFA pushes orders here
    Route::post('orders/{id}/approve', [OrderController::class, 'approveOrder']);
    Route::post('orders/{id}/reject', [OrderController::class, 'rejectOrder']);
    Route::put('orders/{id}', [OrderController::class, 'updateOrder']);

    // GPS Logging
    Route::post('gps/ping', [RouteController::class, 'logLiveGps']);
});`
    },
    {
      title: "Laravel User Deactivation & Active Middleware",
      language: "php",
      filename: "app/Http/Middleware/EnsureUserIsActive.php",
      code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use App\\Models\\User;
use Tymon\\JWTAuth\\Facades\\JWTAuth;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     * Crucial Requirement: If user is deactivated/suspended from server, 
     * access to all connected apps (Mobile, Web, Desktop) stops instantly.
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user || $user->status !== 'Active') {
                // Invalidate JWT session immediately
                JWTAuth::invalidate(JWTAuth::getToken());
                
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is deactivated, suspended or pending. Device session terminated.'
                ], 403);
            }
        } catch (\\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized Access. JWT Signature is invalid.'
            ], 401);
        }

        return $next($request);
    }
}`
    },
    {
      title: "Laravel Device Binding Middleware",
      language: "php",
      filename: "app/Http/Middleware/DeviceBindingMiddleware.php",
      code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Tymon\\JWTAuth\\Facades\\JWTAuth;

class DeviceBindingMiddleware
{
    /**
     * Handle device security. SFA and Desktop apps bind to an initial IMEI/UUID.
     * Prevents sharing Login IDs across random unauthorized mobile phones.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $deviceUuid = $request->header('X-Device-UUID');

        if ($user && $user->device_uuid) {
            if (empty($deviceUuid) || $user->device_uuid !== $deviceUuid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Security Error: This Login ID is strictly bound to another physical device. Contact admin.'
                ], 412); // Precondition Failed
            }
        }

        return $next($request);
    }
}`
    },
    {
      title: "Laravel JWT & Device Authenticator API Controller",
      language: "php",
      filename: "app/Http/Controllers/AuthController.php",
      code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\User;
use App\\Models\\AuditLog;
use Illuminate\\Support\\Facades\\Hash;
use Tymon\\JWTAuth\\Facades\\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
            'device_uuid' => 'nullable|string'
        ]);

        $credentials = [
            'login_id' => $request->login_id,
            'password' => $request->password
        ];

        // 1. Verify user status is Active first
        $user = User::where('login_id', $request->login_id)->first();
        if (!$user || $user->status !== 'Active') {
            return response()->json(['success' => false, 'message' => 'Account is deactivated, suspended or invalid.'], 403);
        }

        // 2. Try authenticating via JWT
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['success' => false, 'message' => 'Invalid Login credentials.'], 401);
        }

        // 3. Device Binding Setup on First Use / Match Verification
        if ($request->filled('device_uuid')) {
            if (!$user->device_uuid) {
                // Bind user to this device UUID permanently on initial login
                $user->device_uuid = $request->device_uuid;
                $user->save();
            } else if ($user->device_uuid !== $request->device_uuid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access Denied: Login ID is bound to a different physical hardware device.'
                ], 412);
            }
        }

        // 4. Log IP and Activity
        $user->last_ip = $request->ip();
        $user->last_active_at = now();
        $user->save();

        AuditLog::create([
            'user_login_id' => $user->login_id,
            'action' => 'User logged in successfully',
            'module' => 'Authentication',
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'login_id' => $user->login_id,
                'name' => $user->name,
                'role' => $user->role,
                'distribution_id' => $user->company_id,
                'route_id' => $user->assigned_route_id,
                'device_uuid' => $user->device_uuid
            ]
        ]);
    }

    public function createUser(Request $request)
    {
        // Require Super Admin or Company Admin permissions
        $admin = JWTAuth::parseToken()->authenticate();
        if (!in_array($admin->role, ['Super Admin', 'Company Admin', 'Manager'])) {
            return response()->json(['success' => false, 'message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'login_id' => 'required|string|unique:users',
            'name' => 'required|string',
            'password' => 'required|string|min:4',
            'role' => 'required|string',
            'company_id' => 'required|integer',
            'assigned_route_id' => 'nullable|integer'
        ]);

        $user = User::create([
            'login_id' => $request->login_id,
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'company_id' => $request->company_id,
            'assigned_route_id' => $request->assigned_route_id,
            'status' => 'Active'
        ]);

        return response()->json(['success' => true, 'user' => $user], 201);
    }
}`
    },
    {
      title: "Laravel Encrypted License Generator & Validator",
      language: "php",
      filename: "app/Http/Controllers/LicenseController.php",
      code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\License;
use App\\Models\\Company;
use Illuminate\\Support\\Str;

class LicenseController extends Controller
{
    /**
     * Generate an encrypted .LIC file or JSON string containing RSA digital signatures.
     */
    public function generate(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'type' => 'required|in:Trial,Monthly,Yearly,Lifetime',
            'device_limit' => 'required|integer',
            'user_limit' => 'required|integer',
            'days' => 'required|integer'
        ]);

        $company = Company::find($request->company_id);
        $activationDate = now()->toDateString();
        $expiryDate = now()->addDays($request->days)->toDateString();
        $licenseId = 'LIC-' . Str::upper(Str::random(10));

        // Metadata block to sign
        $licenseMetadata = [
            'license_id' => $licenseId,
            'company_name' => $company->name,
            'activation_date' => $activationDate,
            'expiry_date' => $expiryDate,
            'device_limit' => $request->device_limit,
            'user_limit' => $request->user_limit,
            'created_at' => now()->toIso8601String()
        ];

        // 1. Convert metadata to raw string
        $rawData = json_encode($licenseMetadata);

        // 2. Generate Digital RSA Signature using OpenSSL private keys
        $privateKeyResource = openssl_pkey_new([
            "private_key_bits" => 2048,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        ]);
        openssl_pkey_export($privateKeyResource, $privateKeyPem);
        
        openssl_sign($rawData, $signature, $privateKeyPem, OPENSSL_ALGO_SHA256);
        $encodedSignature = base64_encode($signature);

        // 3. Encrypt entire payload using AES-256 with server master key
        $aesKey = hash('sha256', config('app.key'));
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encryptedPayload = openssl_encrypt(
            $rawData, 
            'aes-256-cbc', 
            $aesKey, 
            0, 
            $iv
        );
        $encryptedLicenseString = base64_encode($encryptedPayload . '::' . $iv);

        // Save DB Record
        $license = License::create([
            'company_id' => $request->company_id,
            'license_key' => $encryptedLicenseString,
            'type' => $request->type,
            'activation_date' => $activationDate,
            'expiry_date' => $expiryDate,
            'device_limit' => $request->device_limit,
            'user_limit' => $request->user_limit,
            'digital_signature' => $encodedSignature,
            'status' => 'Active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'License file generated successfully.',
            'license_id' => $licenseId,
            'file_content' => [
                'license_id' => $licenseId,
                'encrypted_payload' => $encryptedLicenseString,
                'signature' => $encodedSignature,
                'meta' => $licenseMetadata
            ]
        ]);
    }

    public function exportLicenseFile($id)
    {
        $license = License::with('company')->findOrFail($id);
        
        $fileContent = json_encode([
            'license_id' => 'LIC-' . $license->id,
            'company_name' => $license->company->name,
            'encrypted_payload' => $license->license_key,
            'signature' => $license->digital_signature,
            'meta' => [
                'type' => $license->type,
                'activation' => $license->activation_date,
                'expiry' => $license->expiry_date,
                'devices' => $license->device_limit,
                'users' => $license->user_limit,
            ]
        ], JSON_PRETTY_PRINT);

        $headers = [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="distrohub_license_' . $license->id . '.lic"',
        ];

        return response($fileContent, 200, $headers);
    }
}`
    }
  ],
  flutter: [
    {
      title: "Flutter SFA API Client Service (JWT & Offline)",
      language: "dart",
      filename: "lib/services/sfa_api_service.dart",
      code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';

class SfaApiService {
  final String baseUrl = "https://erp.distrohub.enterprise/api";
  
  // Save JWT & Device Bind locally
  Future<void> saveSession(String token, String deviceUuid) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
    await prefs.setString('device_uuid', deviceUuid);
  }

  // Set standard headers with device security binding and JWT
  Future<Map<String, String>> getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token') ?? '';
    final deviceUuid = prefs.getString('device_uuid') ?? '';
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
      'X-Device-UUID': deviceUuid, // Critical for hardware compliance
    };
  }

  // Geo-radius fenced order pusher
  Future<bool> submitOrder({
    required int shopId,
    required double shopLat,
    required double shopLng,
    required int shopRadius, // radius fence limit e.g. 50 meters
    required List<Map<String, dynamic>> orderItems,
  }) async {
    // 1. Get Live GPS of Order Booker
    Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    
    // 2. Check Geo-Fence Distance compliance from Shop center coordinates
    double distanceInMeters = Geolocator.distanceBetween(
      position.latitude, position.longitude, shopLat, shopLng
    );

    if (distanceInMeters > shopRadius) {
      throw Exception("Geo-Radius Compliance Error: You must be physically inside the shop radius ($shopRadius meters) to book orders. Current distance: \${distanceInMeters.toStringAsFixed(1)}m");
    }

    // 3. Post order to central ERP
    final headers = await getHeaders();
    final url = Uri.parse("$baseUrl/orders");
    
    final payload = jsonEncode({
      'shop_id': shopId,
      'latitude': position.latitude,
      'longitude': position.longitude,
      'items': orderItems
    });

    final response = await http.post(url, headers: headers, body: payload);
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return true;
    } else {
      final errorMsg = jsonDecode(response.body)['message'] ?? "Unknown Error";
      throw Exception("ERP rejection: $errorMsg");
    }
  }

  // Push new shop induction request from SFA mobile app
  Future<bool> requestShopInduction({
    required String shopName,
    required String ownerName,
    required String mobile,
    required String address,
    required double lat,
    required double lng,
    required double creditLimit,
  }) async {
    final headers = await getHeaders();
    final url = Uri.parse("$baseUrl/shops/induction");
    
    final response = await http.post(
      url, 
      headers: headers, 
      body: jsonEncode({
        'shop_name': shopName,
        'owner_name': ownerName,
        'mobile': mobile,
        'address': address,
        'latitude': lat,
        'longitude': lng,
        'credit_limit': creditLimit
      })
    );
    
    return response.statusCode == 200 || response.statusCode == 201;
  }
}`
    },
    {
      title: "Flutter Offline SQL database cache logic",
      language: "dart",
      filename: "lib/db/offline_database.dart",
      code: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class OfflineDatabase {
  static final OfflineDatabase instance = OfflineDatabase._init();
  static Database? _database;

  OfflineDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('distrohub_offline.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
    // 1. Local Cache of Assigned Route Shops
    await db.execute('''
      CREATE TABLE cached_shops (
        id INTEGER PRIMARY KEY,
        shop_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        mobile TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        geo_radius INTEGER,
        credit_limit REAL,
        outstanding_balance REAL
      )
    ''');

    // 2. Queue for Offline Booked Orders (Synchronizes automatically when network is active)
    await db.execute('''
      CREATE TABLE offline_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        items_payload TEXT NOT NULL, -- JSON string
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL,
        sync_status INTEGER DEFAULT 0 -- 0 = Pending, 1 = Synced
      )
    ''');
  }

  Future<int> insertOfflineOrder(Map<String, dynamic> order) async {
    final db = await instance.database;
    return await db.insert('offline_orders', order);
  }

  Future<List<Map<String, dynamic>>> getUnsyncedOrders() async {
    final db = await instance.database;
    return await db.query('offline_orders', where: 'sync_status = 0');
  }

  Future<void> markAsSynced(int id) async {
    final db = await instance.database;
    await db.update(
      'offline_orders', 
      {'sync_status': 1}, 
      where: 'id = ?', 
      whereArgs: [id]
    );
  }
}`
    }
  ],
  deployment: [
    {
      title: "Dockerfile (Laravel FPM + Alpine)",
      language: "dockerfile",
      filename: "Dockerfile",
      code: `FROM php:8.2-fpm-alpine

# Install System dependencies and MySQL PHP Drivers
RUN apk add --no-cache \\
    libjpeg-turbo-dev \\
    libpng-dev \\
    libwebp-dev \\
    freetype-dev \\
    libzip-dev \\
    zip \\
    unzip \\
    git \\
    nginx \\
    supervisor

RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install gd pdo pdo_mysql zip opcache

# Copy Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy ERP Codebase
COPY . .

# Run composer installation
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Setup Storage Permissions for logs & uploads
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Copy deployment configurations
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]`
    },
    {
      title: "docker-compose.yml (Central Platform Stack)",
      language: "yaml",
      filename: "docker-compose.yml",
      code: `version: '3.8'

services:
  # 1. DistroHub Laravel Web App & APIs
  erp-server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: distrohub-erp-server
    restart: always
    ports:
      - "8000:80"
    volumes:
      - .:/var/www
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_KEY=base64:XmE9b29kZXNpZ25lcjIwMjZlcnBzZWN1cmU=
      - DB_CONNECTION=mysql
      - DB_HOST=erp-db
      - DB_PORT=3306
      - DB_DATABASE=distrohub_erp
      - DB_USERNAME=distro_admin
      - DB_PASSWORD=DistroSecurePass2026
      - JWT_SECRET=DistroHubJWTSecretKeySignature99882211
    depends_on:
      - erp-db

  # 2. MySQL Enterprise Database
  erp-db:
    image: mysql:8.0
    container_name: distrohub-erp-db
    restart: always
    ports:
      - "3306:3306"
    environment:
      - MYSQL_DATABASE=distrohub_erp
      - MYSQL_USER=distro_admin
      - MYSQL_PASSWORD=DistroSecurePass2026
      - MYSQL_ROOT_PASSWORD=RootDistroPassWord2026
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:`
    }
  ]
};
