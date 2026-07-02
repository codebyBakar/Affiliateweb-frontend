import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';
import { useProducts } from '../hooks/useData.js';
import { UserEmptyState } from '../components/ui/EmptyState.jsx';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ui/ScrollReveal.jsx';

export default function TrendingPage() {
  const navigate = useNavigate();
  const { data: trendingData, loading: tLoading, error: tError } = useProducts({ trending: true, limit: 20 });

  const trending = trendingData?.products || [];

  return (
    <div className="page-content">
      {/* Simple Header */}
      <ScrollReveal delay={0.1} variant="fadeUp">
        <section className="section" style={{ paddingTop: 'clamp(38px, 6vh, 80px)', paddingBottom: 30}}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="t-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="trending" size={12} stroke="var(--clay)" fill="var(--clay)" />
                  Trending
                </span>
                <h1 className="t-h2" style={{ marginTop: 8 }}>Top Picks This Week</h1>
              </div>
              <button className="btn btn-outline btn-md" onClick={() => navigate('/shop')}>
                View All <Icon name="arrow-r" size={14} />
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trending Products Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {tError && (
            <UserEmptyState
              type="products"
              hasError={true}
              title="Unable to load trending products"
              actionLabel="Retry"
              onAction={() => window.location.reload()}
            />
          )}
          {!tError && !tLoading && trending.length === 0 && (
            <UserEmptyState
              type="products"
              hasError={false}
              title="No trending products yet"
              description="Check back soon for this week's top picks!"
            />
          )}
          {!tError && (tLoading || trending.length > 0) && (
            <>
              {tLoading ? (
                <SkeletonGrid count={20} cols="grid-4" />
              ) : (
                <StaggerContainer>
                  <div className="grid-4">
                    {trending.map((p, i) => (
                      <StaggerItem key={p._id} style={{ transitionDelay: i * 0.04 }}>
                        <ProductCard product={p} index={i} />
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}