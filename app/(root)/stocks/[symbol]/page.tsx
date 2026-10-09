import { Suspense } from "react";
import { CandlestickChart } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeader, { StockHeaderSkeleton } from "@/components/stocks/StockHeader";
import StockSentimentCard from "@/components/stocks/StockSentimentCard";
import Panel from "@/components/Panel";
import {
    CANDLE_CHART_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { getStockSentimentInsights } from '@/lib/actions/adanos.actions';
import { formatSymbolForTradingView, isChartEmbeddable, tradingViewSymbolUrl } from '@/lib/utils';

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

async function Sentiment({ symbol }: { symbol: string }) {
    const insight = await getStockSentimentInsights(symbol);
    if (!insight) return null;
    return (
        <Panel title="סנטימנט" sub="Reddit, X.com, חדשות ו-Polymarket">
            <StockSentimentCard insight={insight} />
        </Panel>
    );
}

// Charts come straight from TradingView (live, no quota); only the header waits on Finnhub, and it streams.
export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol: rawSymbol } = await params;
    const symbol = decodeURIComponent(rawSymbol).toUpperCase();
    const tvSymbol = formatSymbolForTradingView(symbol);

    return (
        <>
            <Suspense fallback={<StockHeaderSkeleton />}>
                <StockHeader symbol={symbol} />
            </Suspense>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
                <div className="flex min-w-0 flex-col gap-3">
                    {isChartEmbeddable(tvSymbol) ? (
                        <Panel title="גרף" sub="חי מ-TradingView · שינוי טווח וסגנון בתוך הגרף">
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}advanced-chart.js`}
                                config={CANDLE_CHART_WIDGET_CONFIG(tvSymbol)}
                                height={560}
                                allowExpand
                            />
                        </Panel>
                    ) : (
                        // TradingView refuses this exchange's chart in embeds; say so instead of showing its error
                        <Panel title="גרף" sub="בבורסה הזו זמין רק באתר TradingView">
                            <div className="empty-state py-14">
                                <span className="empty-icon"><CandlestickChart className="size-5" /></span>
                                <h3>הגרף לא זמין כאן</h3>
                                <p className="max-w-80 text-[13px]">
                                    TradingView לא מרשה הטמעת גרפים של {tvSymbol.split(':')[0]} באתרים אחרים. הדוחות, האינדיקטורים והפרופיל שלמטה עדיין עובדים.
                                </p>
                                <a href={tradingViewSymbolUrl(tvSymbol)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-2">
                                    פתחו את הגרף ב-TradingView
                                </a>
                            </div>
                        </Panel>
                    )}
                    <Panel title="דוחות כספיים" sub="דוח רווח והפסד, מאזן ויחסים פיננסיים">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}financials.js`}
                            config={COMPANY_FINANCIALS_WIDGET_CONFIG(tvSymbol)}
                            height={500}
                        />
                    </Panel>
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                    <Panel title="אינדיקטורים" sub="אוסילטורים וממוצעים נעים, שעה">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}technical-analysis.js`}
                            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(tvSymbol)}
                            height={400}
                        />
                    </Panel>
                    <Suspense fallback={null}>
                        <Sentiment symbol={symbol} />
                    </Suspense>
                    <Panel title="פרופיל החברה" sub="במה החברה עוסקת">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}symbol-profile.js`}
                            config={COMPANY_PROFILE_WIDGET_CONFIG(tvSymbol)}
                            height={440}
                        />
                    </Panel>
                </div>
            </div>
        </>
    );
}
