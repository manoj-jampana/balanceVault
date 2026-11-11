
import { useCallback, useEffect, useState } from "react";
import { Plus, Search, WalletCards, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [action, setAction] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [ledger, setLedger] = useState([]);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getAccounts();
      const list = result.accounts || [];
      setAccounts(list);

      const ledgerResults = await Promise.all(
        list.map(async (account) => {
          const response = await api.getLedger(account.id);
          const entries = response.entries || [];

          const balance = entries.reduce((total, entry) => {
            const value = Number(entry.amount);
            return total + (entry.entryType === "CREDIT" ? value : -value);
          }, 0);

          return [account.id, { balance, entries }];
        })
      );

      setBalances(Object.fromEntries(ledgerResults));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  async function addAccount(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await api.createAccount(name.trim(), "INR");
      setName("");
      setShowForm(false);
      setMessage("Account created successfully.");
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function openAccountAction(accountId, selectedAction) {
    setSelectedId(accountId);
    setAction(selectedAction);
    setAmount("");
    setDestinationId("");
    setMessage("");
    setError("");

    try {
      const result = await api.getLedger(accountId);
      setLedger(result.entries || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitTransaction(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const value = Number(amount);

      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("Enter a valid positive amount.");
      }

      if (action === "deposit") {
        await api.deposit(selectedId, value);
        setMessage("Deposit recorded successfully.");
      } else if (action === "withdraw") {
        await api.withdraw(selectedId, value);
        setMessage("Withdrawal recorded successfully.");
      } else {
        if (!destinationId) {
          throw new Error("Select a destination account.");
        }

        await api.transfer(selectedId, destinationId, value);
        setMessage("Transfer completed successfully.");
      }

      setAmount("");

      const result = await api.getLedger(selectedId);
      setLedger(result.entries || []);

      await loadAccounts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const filtered = accounts.filter((account) =>
    `${account.name} ${account.accountNumber}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const selectedAccount = accounts.find((a) => a.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            ACCOUNT MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            My accounts
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage accounts and view ledger balances.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadAccounts}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
          >
            <RefreshCw size={17} /> Refresh
          </button>

          <button
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
          >
            <Plus size={17} /> Add account
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {message}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={addAccount}
          className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={80}
            placeholder="Account display name"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3"
          />
          <button
            disabled={busy}
            className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save account"}
          </button>
        </form>
      )}

      <div className="flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search accounts..."
          className="w-full border-0 py-3 outline-none"
        />
      </div>

      {loading ? (
        <p className="py-8 text-center text-slate-500">Loading accounts...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Account</span>
            <span>Status</span>
          </div>

          {filtered.map((account) => (
            <div
              key={account.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <WalletCards size={20} />
                </span>
                <div>
                  <p className="font-bold text-slate-800">{account.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {account.accountNumber} · {account.currency}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Balance: {account.currency}{" "}
                    {(balances[account.id]?.balance || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={account.status} />
                <button
                  onClick={() => openAccountAction(account.id, "deposit")}
                  className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700"
                >
                  Deposit
                </button>
                <button
                  onClick={() => openAccountAction(account.id, "withdraw")}
                  className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => openAccountAction(account.id, "transfer")}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
                >
                  Transfer
                </button>
                <button
                  onClick={() => openAccountAction(account.id, "history")}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  History
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              No accounts match your search.
            </p>
          )}
        </div>
      )}

      {selectedId && selectedAccount && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedAccount.name}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedAccount.accountNumber}
              </p>
            </div>
            <button
              onClick={() => setSelectedId("")}
              className="text-sm font-semibold text-slate-500"
            >
              Close
            </button>
          </div>

          {action !== "history" && (
            <form onSubmit={submitTransaction} className="space-y-3">
              <h3 className="font-bold capitalize">{action} money</h3>

              {action === "transfer" && (
                <select
                  value={destinationId}
                  onChange={(event) => setDestinationId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                >
                  <option value="">Select destination account</option>
                  {accounts
                    .filter((a) => a.id !== selectedId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.accountNumber})
                      </option>
                    ))}
                </select>
              )}

              <input
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />

              <button
                disabled={busy}
                className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                {busy ? "Processing..." : `Confirm ${action}`}
              </button>
            </form>
          )}

          <div>
            <h3 className="mb-3 font-bold">Transaction history</h3>
            {ledger.length === 0 ? (
              <p className="text-sm text-slate-500">No transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {ledger.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {entry.description || entry.entryType}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${
                        entry.entryType === "CREDIT"
                          ? "text-green-700"
                          : "text-rose-700"
                      }`}
                    >
                      {entry.entryType === "CREDIT" ? "+" : "-"}
                      {entry.currency} {Number(entry.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
