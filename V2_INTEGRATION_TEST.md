# 🧪 **V2 Integration Test Guide**

## **Quick Test Checklist**

### **✅ Frontend Test Steps:**

1. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   # Should open at http://localhost:3001
   ```

2. **Connect Wallet**
   - Click "Connect Wallet" button
   - Use Stacks testnet wallet
   - Verify connection shows your address

3. **Test Profile Creation (V2)**
   - Go to Blockchain Debugger component
   - Click "Create Test Profile" 
   - Check wallet popup shows `stacksfit-v2` contract
   - Approve transaction

4. **Test Progress Recording (V2)**
   - Click "Record Test Progress"
   - Check wallet popup shows `stacksfit-v2` contract
   - Verify 15 parameters are being sent
   - Approve transaction

5. **Test Data Reading (V2)**
   - Check if profile data loads
   - Check if progress history shows
   - Verify achievements display
   - Look for real blockchain data (not dummy data)

### **🔍 What to Look For:**

#### **Success Indicators:**
- ✅ Wallet popups show `stacksfit-v2` contract
- ✅ Transaction confirmations
- ✅ Real data appears in dashboard
- ✅ No "dummy data" messages
- ✅ Browser console shows V2 API calls

#### **Failure Indicators:**
- ❌ Contract errors in console
- ❌ Still seeing dummy data
- ❌ API calls to `/fitness/` instead of `/stacksfit-v2/`
- ❌ Empty dashboard after transactions

### **🐛 Common Issues:**

1. **"Contract not found"** → V2 contract deployment issue
2. **"Function not found"** → Wrong function name
3. **"Invalid arguments"** → Parameter mismatch
4. **"Dummy data still showing"** → Read functions not updated

### **📊 Expected Results:**

After successful testing:
- Profile creation works ✅
- Progress recording works ✅  
- Data reads back from blockchain ✅
- Dashboard shows real data ✅
- All API calls use V2 contract ✅

---

## **Ready to Test?**

1. Frontend should be running at http://localhost:3001
2. Have testnet STX in your wallet
3. Follow the test steps above
4. Report any issues found

**This test will confirm our V2 integration is working end-to-end!**