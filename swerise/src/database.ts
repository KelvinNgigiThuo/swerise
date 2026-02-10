import SQLite from "react-native-sqlite-storage";
import { DebtInfo, Sale, ProductWithPrice, StockBalance, SaleInput, StockThreshold } from "./screens/types";

SQLite.enablePromise(true);
SQLite.DEBUG(true);

const db = SQLite.openDatabase({ name: "swerise.db", location: "default" });

const generateClientId = () =>
  `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const executeSql = async (sql: string, params: any[] = []) => {
  const database = await db;
  return new Promise<SQLite.ResultSet>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const addColumnIfMissing = async (table: string, column: string, definition: string) => {
  const info = await executeSql(`PRAGMA table_info(${table});`);
  const existing = [];
  for (let i = 0; i < info.rows.length; i++) {
    existing.push(info.rows.item(i).name);
  }
  if (!existing.includes(column)) {
    await executeSql(`ALTER TABLE ${table} ADD COLUMN ${definition};`);
  }
};

const createUsersTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner','employee')),
      password TEXT NOT NULL,
      shop_id INTEGER,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (shop_id) REFERENCES shops (shop_id)
    );`
  );
  await addColumnIfMissing("users", "full_name", "full_name TEXT");
  await addColumnIfMissing("users", "client_id", "client_id TEXT");
  await addColumnIfMissing("users", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createShopsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS shops (
      shop_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      last_sync TIMESTAMP,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0
    );`
  );
  await addColumnIfMissing("shops", "client_id", "client_id TEXT");
  await addColumnIfMissing("shops", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createProductsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );`
  );
  await addColumnIfMissing("products", "is_active", "is_active INTEGER DEFAULT 1");
};

const createPricesTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS prices (
      price_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      price REAL NOT NULL,
      effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1,
      set_by_user_id INTEGER,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );`
  );
  await addColumnIfMissing("prices", "client_id", "client_id TEXT");
  await addColumnIfMissing("prices", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createCustomersTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      shop_id INTEGER NOT NULL,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      UNIQUE(phone, shop_id),
      FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
    );`
  );
  await addColumnIfMissing("customers", "client_id", "client_id TEXT");
  await addColumnIfMissing("customers", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createSalesTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS sales (
      sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      shop_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      employee_id INTEGER,
      sale_type TEXT NOT NULL CHECK(sale_type IN ('cash','debt')),
      customer_id INTEGER,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );`
  );
  await addColumnIfMissing("sales", "client_id", "client_id TEXT");
  await addColumnIfMissing("sales", "unit_price", "unit_price REAL NOT NULL DEFAULT 0");
  await addColumnIfMissing("sales", "customer_id", "customer_id INTEGER");
  await addColumnIfMissing("sales", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createDebtsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS debts (
      debt_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      amount_due REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (sale_id) REFERENCES sales(sale_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );`
  );
  await addColumnIfMissing("debts", "client_id", "client_id TEXT");
  await addColumnIfMissing("debts", "customer_id", "customer_id INTEGER");
  await addColumnIfMissing("debts", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createDebtPaymentsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS debt_payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      debt_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      received_by INTEGER,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (debt_id) REFERENCES debts(debt_id)
    );`
  );
  await addColumnIfMissing("debt_payments", "client_id", "client_id TEXT");
  await addColumnIfMissing("debt_payments", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createStockMovementsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS stock_movements (
      movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      movement_type TEXT NOT NULL CHECK(movement_type IN ('restock','sale','adjustment')),
      reference_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );`
  );
  await addColumnIfMissing("stock_movements", "client_id", "client_id TEXT");
  await addColumnIfMissing("stock_movements", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createStockThresholdsTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS stock_thresholds (
      shop_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      threshold_quantity REAL NOT NULL,
      client_id TEXT,
      sync_status INTEGER DEFAULT 0,
      PRIMARY KEY (shop_id, product_id),
      FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );`
  );
  await addColumnIfMissing("stock_thresholds", "client_id", "client_id TEXT");
  await addColumnIfMissing("stock_thresholds", "sync_status", "sync_status INTEGER DEFAULT 0");
};

const createSyncQueueTable = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS sync_queue (
      queue_id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      operation TEXT NOT NULL CHECK(operation IN ('create','update','delete')),
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempt_count INTEGER DEFAULT 0,
      last_attempt_at TIMESTAMP,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  );
};

const seedDefaultShop = async () => {
  const result = await executeSql(`SELECT COUNT(*) AS count FROM shops;`);
  const count = result.rows.item(0).count as number;
  if (count === 0) {
    await executeSql(
      `INSERT INTO shops (name, location, is_active, client_id, sync_status) VALUES (?, ?, 1, ?, 0);`,
      ["Main Shop", "Nairobi", generateClientId()]
    );
  }
};

const seedProducts = async () => {
  const result = await executeSql(`SELECT COUNT(*) AS count FROM products;`);
  const count = result.rows.item(0).count as number;
  if (count > 0) {
    return;
  }
  const products = [
    { name: "Diesel", category: "fuel", unit: "L" },
    { name: "Petrol", category: "fuel", unit: "L" },
    { name: "Kerosene", category: "fuel", unit: "L" },
    { name: "Gas 6kg", category: "gas", unit: "cyl" },
    { name: "Gas 13kg", category: "gas", unit: "cyl" }
  ];
  for (const product of products) {
    await executeSql(
      `INSERT INTO products (name, category, unit, is_active) VALUES (?, ?, ?, 1);`,
      [product.name, product.category, product.unit]
    );
  }
};

const seedDefaultPrices = async () => {
  const result = await executeSql(`SELECT COUNT(*) AS count FROM prices;`);
  const count = result.rows.item(0).count as number;
  if (count > 0) {
    return;
  }
  const products = await executeSql(`SELECT product_id FROM products;`);
  for (let i = 0; i < products.rows.length; i++) {
    const productId = products.rows.item(i).product_id as number;
    await executeSql(
      `INSERT INTO prices (product_id, price, is_active, client_id, sync_status) VALUES (?, 0, 1, ?, 0);`,
      [productId, generateClientId()]
    );
  }
};

const seedDefaultThresholds = async () => {
  const shopResult = await executeSql(`SELECT shop_id FROM shops LIMIT 1;`);
  if (shopResult.rows.length === 0) {
    return;
  }
  const shopId = shopResult.rows.item(0).shop_id as number;
  const existing = await executeSql(
    `SELECT COUNT(*) AS count FROM stock_thresholds WHERE shop_id = ?;`,
    [shopId]
  );
  const count = existing.rows.item(0).count as number;
  if (count > 0) {
    return;
  }
  const products = await executeSql(`SELECT product_id FROM products;`);
  for (let i = 0; i < products.rows.length; i++) {
    const productId = products.rows.item(i).product_id as number;
    await executeSql(
      `INSERT INTO stock_thresholds (shop_id, product_id, threshold_quantity, client_id, sync_status) VALUES (?, ?, ?, ?, 0);`,
      [shopId, productId, 0, generateClientId()]
    );
  }
};

const insertDefaultUsers = async () => {
  const result = await executeSql(
    `SELECT COUNT(*) AS count FROM users WHERE username IN (?, ?);`,
    ["owner", "employee"]
  );
  const count = result.rows.item(0).count as number;
  if (count === 0) {
    await executeSql(
      `INSERT INTO users (username, full_name, role, password, shop_id, client_id, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, 0);`,
      ["owner", "Owner Name", "owner", "owner123", null, generateClientId()]
    );
    await executeSql(
      `INSERT INTO users (username, full_name, role, password, shop_id, client_id, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, 0);`,
      ["employee", "Employee Name", "employee", "employee123", 1, generateClientId()]
    );
  }
};

const enqueueSync = async (entityType: string, operation: "create" | "update" | "delete", payload: any) => {
  await executeSql(
    `INSERT INTO sync_queue (entity_type, operation, payload, status) VALUES (?, ?, ?, 'pending');`,
    [entityType, operation, JSON.stringify(payload)]
  );
};

const enqueueSyncTx = (tx: any, entityType: string, operation: "create" | "update" | "delete", payload: any) => {
  tx.executeSql(
    `INSERT INTO sync_queue (entity_type, operation, payload, status) VALUES (?, ?, ?, 'pending');`,
    [entityType, operation, JSON.stringify(payload)]
  );
};

export const fetchUserCredentials = async (username: string) => {
  const result = await executeSql(
    `SELECT username, password, role, shop_id FROM users WHERE username = ?`,
    [username]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows.item(0);
  return {
    username: user.username,
    password: user.password,
    role: user.role,
    shop_id: user.shop_id
  };
};

export const getProductsWithCurrentPrice = async (): Promise<ProductWithPrice[]> => {
  const result = await executeSql(
    `SELECT p.product_id, p.name, p.category, p.unit,
        COALESCE(pr.price, 0) AS price
     FROM products p
     LEFT JOIN prices pr
       ON pr.product_id = p.product_id AND pr.is_active = 1
     WHERE p.is_active = 1
     ORDER BY p.product_id ASC;`
  );
  const products: ProductWithPrice[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    products.push(result.rows.item(i));
  }
  return products;
};

export const setProductPrice = async (
  productId: number,
  price: number,
  setByUserId?: number | null
) => {
  await executeSql(`UPDATE prices SET is_active = 0 WHERE product_id = ?;`, [productId]);
  const clientId = generateClientId();
  await executeSql(
    `INSERT INTO prices (product_id, price, is_active, set_by_user_id, client_id, sync_status)
     VALUES (?, ?, 1, ?, ?, 0);`,
    [productId, price, setByUserId ?? null, clientId]
  );
  await enqueueSync("prices", "create", { client_id: clientId, product_id: productId, price });
};

export const ensureCustomer = async (shopId: number, name: string, phone: string) => {
  const result = await executeSql(
    `SELECT customer_id, name, client_id FROM customers WHERE phone = ? AND shop_id = ?;`,
    [phone, shopId]
  );
  if (result.rows.length > 0) {
    const existing = result.rows.item(0);
    if (existing.name !== name) {
      await executeSql(`UPDATE customers SET name = ?, sync_status = 0 WHERE customer_id = ?;`, [
        name,
        existing.customer_id
      ]);
      await enqueueSync("customers", "update", {
        client_id: existing.client_id,
        name,
        phone,
        shop_id: shopId
      });
    }
    return existing.customer_id as number;
  }

  const clientId = generateClientId();
  const insert = await executeSql(
    `INSERT INTO customers (name, phone, shop_id, client_id, sync_status)
     VALUES (?, ?, ?, ?, 0);`,
    [name, phone, shopId, clientId]
  );
  await enqueueSync("customers", "create", {
    client_id: clientId,
    name,
    phone,
    shop_id: shopId
  });
  return insert.insertId as number;
};

export const insertSale = async (
  sale: SaleInput,
  paymentMethod: "cash" | "debt",
  debt?: DebtInfo
): Promise<number> => {
  const clientId = generateClientId();
  const saleType = paymentMethod;
  const shopId = sale.shop_id;
  let customerId: number | null = null;

  if (saleType === "debt" && debt) {
    customerId = await ensureCustomer(shopId, debt.customer_name, debt.customer_phone);
  }

  const database = await db;
  return new Promise<number>((resolve, reject) => {
    database.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO sales
           (client_id, shop_id, product_id, quantity, unit_price, total_price, sale_date, employee_id, sale_type, customer_id, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, 0);`,
          [
            clientId,
            sale.shop_id,
            sale.product_id,
            sale.quantity,
            sale.unit_price,
            sale.total_price,
            sale.employee_id,
            saleType,
            customerId
          ],
          (_, result) => {
            const saleId = result.insertId as number;

            const movementClientId = generateClientId();
            tx.executeSql(
              `INSERT INTO stock_movements
               (shop_id, product_id, quantity, movement_type, reference_id, created_by, client_id, sync_status)
               VALUES (?, ?, ?, 'sale', ?, ?, ?, 0);`,
              [sale.shop_id, sale.product_id, -Math.abs(sale.quantity), saleId, sale.employee_id, movementClientId]
            );
            enqueueSyncTx(tx, "stock_movements", "create", {
              client_id: movementClientId,
              shop_id: sale.shop_id,
              product_id: sale.product_id,
              quantity: -Math.abs(sale.quantity),
              movement_type: "sale",
              reference_id: saleId
            });

            if (saleType === "debt" && debt && customerId) {
              const debtClientId = generateClientId();
              tx.executeSql(
                `INSERT INTO debts
                 (sale_id, customer_id, amount_due, amount_paid, client_id, sync_status)
                 VALUES (?, ?, ?, 0, ?, 0);`,
                [saleId, customerId, debt.amount_due, debtClientId]
              );
              enqueueSyncTx(tx, "debts", "create", {
                client_id: debtClientId,
                sale_id: saleId,
                customer_id: customerId,
                amount_due: debt.amount_due,
                amount_paid: 0
              });
            }

            enqueueSyncTx(tx, "sales", "create", {
              client_id: clientId,
              shop_id: sale.shop_id,
              product_id: sale.product_id,
              quantity: sale.quantity,
              unit_price: sale.unit_price,
              total_price: sale.total_price,
              sale_type: saleType,
              customer_id: customerId,
              employee_id: sale.employee_id
            });

            resolve(saleId);
          },
          error => reject(error)
        );
      },
      error => reject(error)
    );
  });
};

export const insertDebtPayment = async (debtId: number, amount: number, receivedBy?: number | null) => {
  const clientId = generateClientId();
  await executeSql(
    `INSERT INTO debt_payments (debt_id, amount, received_by, client_id, sync_status)
     VALUES (?, ?, ?, ?, 0);`,
    [debtId, amount, receivedBy ?? null, clientId]
  );
  await executeSql(
    `UPDATE debts SET amount_paid = amount_paid + ?, amount_due = amount_due - ?, sync_status = 0
     WHERE debt_id = ?;`,
    [amount, amount, debtId]
  );
  await enqueueSync("debt_payments", "create", {
    client_id: clientId,
    debt_id: debtId,
    amount,
    received_by: receivedBy ?? null
  });
};

export const insertRestock = async (
  shopId: number,
  productId: number,
  quantity: number,
  createdBy?: number | null
) => {
  const clientId = generateClientId();
  await executeSql(
    `INSERT INTO stock_movements
     (shop_id, product_id, quantity, movement_type, created_by, client_id, sync_status)
     VALUES (?, ?, ?, 'restock', ?, ?, 0);`,
    [shopId, productId, Math.abs(quantity), createdBy ?? null, clientId]
  );
  await enqueueSync("stock_movements", "create", {
    client_id: clientId,
    shop_id: shopId,
    product_id: productId,
    quantity: Math.abs(quantity),
    movement_type: "restock"
  });
};

export const setStockThreshold = async (shopId: number, productId: number, threshold: number) => {
  const existing = await executeSql(
    `SELECT threshold_quantity, client_id FROM stock_thresholds WHERE shop_id = ? AND product_id = ?;`,
    [shopId, productId]
  );
  if (existing.rows.length > 0) {
    const clientId = existing.rows.item(0).client_id as string;
    await executeSql(
      `UPDATE stock_thresholds SET threshold_quantity = ?, sync_status = 0
       WHERE shop_id = ? AND product_id = ?;`,
      [threshold, shopId, productId]
    );
    await enqueueSync("stock_thresholds", "update", {
      client_id: clientId,
      shop_id: shopId,
      product_id: productId,
      threshold_quantity: threshold
    });
    return;
  }
  const clientId = generateClientId();
  await executeSql(
    `INSERT INTO stock_thresholds (shop_id, product_id, threshold_quantity, client_id, sync_status)
     VALUES (?, ?, ?, ?, 0);`,
    [shopId, productId, threshold, clientId]
  );
  await enqueueSync("stock_thresholds", "create", {
    client_id: clientId,
    shop_id: shopId,
    product_id: productId,
    threshold_quantity: threshold
  });
};

export const getStockBalances = async (shopId: number): Promise<StockBalance[]> => {
  const result = await executeSql(
    `SELECT p.product_id, p.name, p.unit, COALESCE(SUM(m.quantity), 0) AS balance
     FROM products p
     LEFT JOIN stock_movements m
       ON m.product_id = p.product_id AND m.shop_id = ?
     WHERE p.is_active = 1
     GROUP BY p.product_id, p.name, p.unit
     ORDER BY p.product_id ASC;`,
    [shopId]
  );
  const balances: StockBalance[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    balances.push(result.rows.item(i));
  }
  return balances;
};

export const getStockThresholds = async (shopId: number): Promise<StockThreshold[]> => {
  const result = await executeSql(
    `SELECT st.product_id, st.threshold_quantity, p.name, p.unit
     FROM stock_thresholds st
     JOIN products p ON p.product_id = st.product_id
     WHERE st.shop_id = ?
     ORDER BY p.product_id ASC;`,
    [shopId]
  );
  const thresholds: StockThreshold[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    thresholds.push(result.rows.item(i));
  }
  return thresholds;
};

export const getSalesByDate = async (dateFilter: "all" | "today" | "week" | "month" = "all"): Promise<Sale[]> => {
  let query = `
    SELECT s.*, p.name AS product_name, p.unit AS product_unit, c.name AS customer_name
    FROM sales s
    LEFT JOIN products p ON p.product_id = s.product_id
    LEFT JOIN customers c ON c.customer_id = s.customer_id
  `;
  const params: string[] = [];
  switch (dateFilter) {
    case "today":
      query += ` WHERE date(s.sale_date) = date('now')`;
      break;
    case "week":
      query += ` WHERE date(s.sale_date) >= date('now', '-7 days')`;
      break;
    case "month":
      query += ` WHERE date(s.sale_date) >= date('now', 'start of month')`;
      break;
    default:
      break;
  }
  query += ` ORDER BY s.sale_date DESC`;

  const result = await executeSql(query, params);
  const sales: Sale[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    sales.push(result.rows.item(i));
  }
  return sales;
};

export const getLastFiveSales = async (): Promise<Sale[]> => {
  const result = await executeSql(
    `SELECT s.*, p.name AS product_name, p.unit AS product_unit, c.name AS customer_name
     FROM sales s
     LEFT JOIN products p ON p.product_id = s.product_id
     LEFT JOIN customers c ON c.customer_id = s.customer_id
     ORDER BY s.sale_date DESC
     LIMIT 5;`
  );
  const sales: Sale[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    sales.push(result.rows.item(i));
  }
  return sales;
};

export const getTodaysSalesTotal = async (): Promise<number> => {
  const result = await executeSql(
    `SELECT SUM(total_price) AS totalSales
     FROM sales
     WHERE date(sale_date) = date('now');`
  );
  const row = result.rows.item(0);
  return row.totalSales || 0;
};

export const getTodaysCreditSales = async (): Promise<number> => {
  const result = await executeSql(
    `SELECT SUM(total_price) AS creditSales
     FROM sales
     WHERE date(sale_date) = date('now') AND sale_type = 'debt';`
  );
  const row = result.rows.item(0);
  return row.creditSales || 0;
};

export const getAllTimeSales = async (): Promise<number> => {
  const result = await executeSql(`SELECT SUM(total_price) AS totalSales FROM sales;`);
  const row = result.rows.item(0);
  return row.totalSales || 0;
};

export const getAllTimeCreditSales = async (): Promise<number> => {
  const result = await executeSql(
    `SELECT SUM(total_price) AS creditSales FROM sales WHERE sale_type = 'debt';`
  );
  const row = result.rows.item(0);
  return row.creditSales || 0;
};

export const getPendingSyncItems = async (limit = 50) => {
  const result = await executeSql(
    `SELECT queue_id, entity_type, operation, payload, attempt_count
     FROM sync_queue
     WHERE status = 'pending'
     ORDER BY queue_id ASC
     LIMIT ?;`,
    [limit]
  );
  const items = [];
  for (let i = 0; i < result.rows.length; i++) {
    items.push(result.rows.item(i));
  }
  return items;
};

export const markSyncSuccess = async (queueId: number) => {
  await executeSql(`UPDATE sync_queue SET status = 'synced' WHERE queue_id = ?;`, [queueId]);
};

export const markSyncFailed = async (queueId: number, errorMessage: string) => {
  await executeSql(
    `UPDATE sync_queue
     SET status = 'pending', attempt_count = attempt_count + 1, last_attempt_at = CURRENT_TIMESTAMP, error_message = ?
     WHERE queue_id = ?;`,
    [errorMessage, queueId]
  );
};

export const initializeDatabase = async () => {
  await createUsersTable();
  await createShopsTable();
  await createProductsTable();
  await createPricesTable();
  await createCustomersTable();
  await createSalesTable();
  await createDebtsTable();
  await createDebtPaymentsTable();
  await createStockMovementsTable();
  await createStockThresholdsTable();
  await createSyncQueueTable();

  await seedDefaultShop();
  await seedProducts();
  await seedDefaultPrices();
  await seedDefaultThresholds();
  await insertDefaultUsers();
};

export default db;
