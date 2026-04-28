import { ArrowDownRight, ArrowUpRight, Database, Scale } from "lucide-react";
import type { PortfolioSnapshot } from "../../domain/portfolio/types";
import type { Language } from "../i18n";
import { AllocationChart } from "../components/AllocationChart";
import { Badge } from "../components/Badge";
import { EfficientFrontierChart } from "../components/EfficientFrontierChart";
import { MetricCard } from "../components/MetricCard";
import { RiskGauge } from "../components/RiskGauge";
import { formatCurrency, formatCurrencyPrecise, formatNeutralPct, formatPct } from "../formatters";

interface DashboardProps {
  snapshot: PortfolioSnapshot;
  language: Language;
}

export const Dashboard = ({ snapshot, language }: DashboardProps) => {
  const isRu = language === "ru";

  return (
    <div className="view-stack">
      {snapshot.assets.length === 0 ? (
        <section className="status-banner status-banner-warning">
          <strong>{isRu ? "Портфель пуст" : "Portfolio is empty"}</strong>
          <span>{isRu ? "Откройте вкладку Активы и добавьте реальные позиции." : "Open Assets and add real positions."}</span>
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label={isRu ? "Баланс" : "Total Balance"}
          value={formatCurrency(snapshot.totalValueUsd)}
          detail={
            isRu
              ? `${snapshot.marketData.livePriceCount}/${snapshot.marketData.totalAssetCount} активов оценены CoinGecko`
              : `${snapshot.marketData.livePriceCount}/${snapshot.marketData.totalAssetCount} assets priced by CoinGecko`
          }
          trend={<Badge tone="navy">{isRu ? "Live data" : "Live data"}</Badge>}
        />
        <MetricCard
          label={isRu ? "Вероятность просадки" : "Drawdown Probability"}
          value={formatNeutralPct(snapshot.risk.drawdownProbabilityPct)}
          detail={`${isRu ? "После QAOA" : "After QAOA"}: ${formatNeutralPct(snapshot.risk.optimizedDrawdownProbabilityPct)}`}
          tone="danger"
          trend={<ArrowDownRight size={18} strokeWidth={1.5} className="text-emeraldStrict" />}
        />
        <MetricCard
          label={isRu ? "Целевая волатильность" : "Target Volatility"}
          value={formatNeutralPct(snapshot.risk.targetVolatilityPct)}
          detail={isRu ? "Расчетная оценка портфеля" : "Portfolio model estimate"}
          trend={<Scale size={18} strokeWidth={1.5} className="text-navy" />}
        />
        <MetricCard
          label={isRu ? "Sharpe Ratio" : "Sharpe Ratio"}
          value={snapshot.risk.sharpeRatio.toFixed(2)}
          detail={isRu ? "После оптимизации" : "Post-optimization projection"}
          tone="success"
          trend={<ArrowUpRight size={18} strokeWidth={1.5} className="text-emeraldStrict" />}
        />
      </div>

      {snapshot.marketData.error ? (
        <section className="status-banner status-banner-warning">
          <strong>{isRu ? "Ошибка market-data" : "Market data warning"}</strong>
          <span>{snapshot.marketData.error}</span>
        </section>
      ) : null}

      <section className="status-banner">
        <strong>{isRu ? "Источник портфеля" : "Portfolio source"}</strong>
        <span>{snapshot.portfolioSource.description}</span>
      </section>

      <div className="grid gap-4 2xl:grid-cols-[1.05fr_1fr_0.95fr]">
        <RiskGauge currentScore={snapshot.risk.currentRiskScore} optimizedScore={snapshot.risk.optimizedRiskScore} />
        <AllocationChart assets={snapshot.assets} />
        <EfficientFrontierChart data={snapshot.frontier} targetVolatilityPct={snapshot.risk.targetVolatilityPct} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="panel">
          <div className="panel-header">
            <h2>{isRu ? "Позиции портфеля" : "Portfolio Positions"}</h2>
            <span>{isRu ? "Живые цены CoinGecko" : "CoinGecko live pricing"}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Cluster</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>24h</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.assets.map((asset) => (
                  <tr key={asset.symbol}>
                    <td>
                      <div className="font-medium text-slate-950">{asset.symbol}</div>
                      <div className="text-xs text-slate-500">{asset.name}</div>
                    </td>
                    <td>{asset.covarianceCluster}</td>
                    <td className="font-mono">{asset.amount.toLocaleString("en-US")}</td>
                    <td className="font-mono">{formatCurrencyPrecise(asset.priceUsd)}</td>
                    <td className="font-mono">{formatNeutralPct(asset.currentWeightPct)}</td>
                    <td className="font-mono">{formatNeutralPct(asset.targetWeightPct)}</td>
                    <td className={`font-mono ${asset.dailyChangePct < 0 ? "text-crimson" : "text-emeraldStrict"}`}>
                      {formatPct(asset.dailyChangePct)}
                    </td>
                    <td>
                      <Badge tone={asset.marketDataSource === "coingecko" ? "success" : asset.marketDataSource === "coingecko-cache" ? "warning" : "danger"}>
                        {asset.marketDataSource}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <section className="panel">
            <div className="panel-header">
              <h2>{isRu ? "Контроль риска" : "Risk Controls"}</h2>
              <span>{isRu ? "Сигналы" : "Signals"}</span>
            </div>
            <div className="space-y-3">
              {snapshot.stressSignals.map((signal) => (
                <div key={signal.name} className="flex items-center justify-between border border-slate-200 px-3 py-3">
                  <div>
                    <div className="text-sm font-medium text-slate-950">{signal.name}</div>
                    <div className="mt-1 font-mono text-xs text-slate-500">{signal.value}</div>
                  </div>
                  <Badge tone={signal.severity === "high" ? "danger" : signal.severity === "medium" ? "warning" : "success"}>
                    {signal.severity}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              <Database size={16} strokeWidth={1.5} />
              <span>{isRu ? "Ковариация считается из кластеров текущего портфеля." : "Covariance is computed from current portfolio clusters."}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
