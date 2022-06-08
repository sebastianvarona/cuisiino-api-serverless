const { Router } = require('express');
const UserController = require('../controllers/UserController');
const BusinessController = require('../controllers/BusinessController');
const ExpenseController = require('../controllers/ExpenseController');
const InventoryController = require('../controllers/InventoryController');
const MenuController = require('../controllers/MenuController');
const OrderController = require('../controllers/OrderController');
const StaffController = require('../controllers/StaffController');

const router = Router();
// Users
router
  .route('/users')
  .get(UserController.getUser)
  .post(UserController.createUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

// Businesses & Taxes
router
  .route('/businesses')
  .get(BusinessController.getBusiness)
  .post(BusinessController.createBusiness)
  .delete(BusinessController.deleteBusiness);
router
  .route('/taxes')
  .post(BusinessController.createTax)
  .delete(BusinessController.deleteTax);

// Expenses
router
  .route('/expenses')
  .get(ExpenseController.getExpenses)
  .post(ExpenseController.createExpense)
  .put(ExpenseController.updateExpense)
  .delete(ExpenseController.deleteExpense);

// Inventories
router
  .route('/inventories')
  .get(InventoryController.getInventories)
  .post(InventoryController.createInventory)
  .put(InventoryController.updateInventory)
  .delete(InventoryController.deleteInventory);

// Menus & Items
router
  .route('/menus')
  .get(MenuController.getMenus)
  .post(MenuController.createMenu)
  .put(MenuController.updateMenu)
  .delete(MenuController.deleteMenu);
router
  .route('/menu/items')
  .post(MenuController.createItem)
  .delete(MenuController.deleteItem);

// Orders
router
  .route('/orders')
  .get(OrderController.getOrders)
  .post(OrderController.createOrder)
  .put(OrderController.updateOrder)
  .delete(OrderController.deleteOrder);
router.route('/order/items').get(OrderController.getOrderItems);

// Staff
router
  .route('/staff')
  .get(StaffController.getStaffs)
  .post(StaffController.createStaff)
  .put(StaffController.updateStaff)
  .delete(StaffController.deleteStaff);

module.exports = router;
