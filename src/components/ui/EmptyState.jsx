import Icon from './Icon.jsx';

const icons = {
  package: <Icon name="package" size={48} stroke="var(--muted)" />,
  search: <Icon name="search" size={48} stroke="var(--muted)" />,
  tag: <Icon name="tag" size={48} stroke="var(--muted)" />,
  category: <Icon name="grid" size={48} stroke="var(--muted)" />,
  product: <Icon name="image" size={48} stroke="var(--muted)" />,
  error: <Icon name="alert-circle" size={48} stroke="var(--rose)" />,
  warning: <Icon name="alert-triangle" size={48} stroke="var(--amber)" />,
  success: <Icon name="check-circle" size={48} stroke="var(--sage)" />,
};

const variantStyles = {
  default: { background: 'var(--canvas)', border: '1px solid var(--border)' },
  error: { background: 'var(--rose-light)', border: '1px solid var(--rose)' },
  warning: { background: '#fff8e1', border: '1px solid var(--amber)' },
  success: { background: 'var(--sage-light)', border: '1px solid var(--sage)' },
  admin: { background: 'var(--canvas)', border: '1px solid var(--border)' },
};

function EmptyState({
  icon = 'package',
  title = 'Nothing here yet',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
  variant = 'default',
  className = '',
}) {
  return (
    <div
      className={`empty-state ${className}`}
      style={{
        ...variantStyles[variant],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        borderRadius: 'var(--radius-xl)',
        minHeight: 280,
      }}
    >
      <div style={{ marginBottom: 20 }}>{icons[icon] || icons.package}</div>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 8,
        color: variant === 'error' ? 'var(--rose)' : variant === 'warning' ? 'var(--amber)' : variant === 'success' ? 'var(--sage)' : 'var(--ink)',
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--muted)',
        fontSize: 14,
        lineHeight: 1.6,
        maxWidth: 320,
        marginBottom: actionLabel ? 24 : 0,
      }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          className="btn btn-primary btn-md"
          onClick={onAction}
          style={{ width: 'auto' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const adminConfigs = {
  products: {
    icon: 'product',
    defaultTitle: 'No products yet',
    defaultDescription: 'Start by adding your first product to the catalog.',
    errorIcon: 'error',
    errorTitle: 'Failed to load products',
    errorDescription: 'Unable to connect to the database. Please check your connection and try again.',
  },
  categories: {
    icon: 'category',
    defaultTitle: 'No categories yet',
    defaultDescription: 'Create your first category to organize products.',
    errorIcon: 'error',
    errorTitle: 'Failed to load categories',
    errorDescription: 'Unable to connect to the database. Please check your connection and try again.',
  },
  tags: {
    icon: 'tag',
    defaultTitle: 'No tags yet',
    defaultDescription: 'Add tags to help filter and organize your products.',
    errorIcon: 'error',
    errorTitle: 'Failed to load tags',
    errorDescription: 'Unable to connect to the database. Please check your connection and try again.',
  },
};

export function AdminEmptyState({
  type = 'products',
  title,
  description,
  actionLabel,
  onAction,
  hasError = false,
}) {
  const cfg = adminConfigs[type] || adminConfigs.products;

  return (
    <EmptyState
      icon={hasError ? cfg.errorIcon : cfg.icon}
      title={title || (hasError ? cfg.errorTitle : cfg.defaultTitle)}
      description={description || (hasError ? cfg.errorDescription : cfg.defaultDescription)}
      actionLabel={actionLabel}
      onAction={onAction}
      variant={hasError ? 'error' : 'admin'}
    />
  );
}

const userConfigs = {
  products: {
    icon: 'product',
    defaultTitle: 'No products found',
    defaultDescription: 'No products have been added yet. Check back soon!',
    errorIcon: 'error',
    errorTitle: 'Unable to load products',
    errorDescription: 'Something went wrong while loading products. Please try again later.',
  },
  categories: {
    icon: 'category',
    defaultTitle: 'No categories available',
    defaultDescription: 'No categories have been created yet.',
    errorIcon: 'error',
    errorTitle: 'Unable to load categories',
    errorDescription: 'Something went wrong while loading categories. Please try again later.',
  },
  search: {
    icon: 'search',
    defaultTitle: 'No results found',
    defaultDescription: 'Try different keywords or browse our categories.',
    errorIcon: 'error',
    errorTitle: 'Search failed',
    errorDescription: 'Something went wrong with your search. Please try again.',
  },
};

export function UserEmptyState({
  type = 'products',
  title,
  description,
  actionLabel,
  onAction,
  hasError = false,
}) {
  const cfg = userConfigs[type] || userConfigs.products;

  return (
    <EmptyState
      icon={hasError ? cfg.errorIcon : cfg.icon}
      title={title || (hasError ? cfg.errorTitle : cfg.defaultTitle)}
      description={description || (hasError ? cfg.errorDescription : cfg.defaultDescription)}
      actionLabel={actionLabel}
      onAction={onAction}
      variant={hasError ? 'error' : 'default'}
    />
  );
}
