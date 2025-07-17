'use client';
import styles from './page.module.css';

const IMSPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Finish Goods Management System</h1>
        <p className={styles.subtitle}>
          Smart, scalable inventory control for Finish businesses.
        </p>
      </header>

      {/* Dashboard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Dashboard</h2>
        <p className={styles.description}>
          Central hub showing real-time inventory KPIs and system status.
        </p>
        <ul className={styles.capabilitiesList}>
          <li className={styles.capabilityItem}>
            <strong>Live Overview:</strong> Stock levels, inbound/outbound status, and reorder alerts.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Analytics & Reporting:</strong> Customizable reports and performance trends.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Smart Insights:</strong> Visualized metrics to aid decision-making.
          </li>
        </ul>
      </section>

      {/* IMS Master */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>IMS Master</h2>
        <p className={styles.description}>
          Manage your inventory structure, product details, and integrations.
        </p>
        <ul className={styles.capabilitiesList}>
          <li className={styles.capabilityItem}>
            <strong>Product Management:</strong> Catalog with specs, pricing, and categories.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Supplier Integration:</strong> Automate purchasing and delivery.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Multi-Location Support:</strong> Central control over warehouses.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Inventory Setup:</strong> Barcode, unit, and location configuration.
          </li>
        </ul>
      </section>

      {/* Live Stock */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Live Stock</h2>
        <p className={styles.description}>
          Get real-time insights into available stock and its movement.
        </p>
        <ul className={styles.capabilitiesList}>
          <li className={styles.capabilityItem}>
            <strong>Inventory Tracking:</strong> Monitor live stock levels with alerts.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Stock Control:</strong> Movement logs and inventory audits.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Quality Assurance:</strong> Compliance and quality checks.
          </li>
        </ul>
      </section>

      {/* In - Out */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>In - Out</h2>
        <p className={styles.description}>
          Handle incoming and outgoing goods with traceability.
        </p>
        <ul className={styles.capabilitiesList}>
          <li className={styles.capabilityItem}>
            <strong>Order Processing:</strong> Track fulfillment from receipt to delivery.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Supply Chain Management:</strong> Visibility and automation from suppliers to customers.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Goods Movement:</strong> Monitor item in-out with full logs.
          </li>
        </ul>
      </section>

      {/* About */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <p className={styles.description}>
          Finish Goods Management System is a modern platform tailored for Finish businesses.
        </p>
        <p className={styles.description}>
          It offers seamless inventory and supply chain control, with real-time updates and scalable support across warehouses.
        </p>
        <p className={styles.description}>
          Built with modern technologies like Next.js 15 and React 18 for performance, security, and compliance.
        </p>
      </section>

      {/* Settings */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Settings</h2>
        <p className={styles.description}>
          Configure system preferences and integrate with business tools.
        </p>
        <ul className={styles.capabilitiesList}>
          <li className={styles.capabilityItem}>
            <strong>Financial Integration:</strong> Connect with accounting systems for cost tracking.
          </li>
          <li className={styles.capabilityItem}>
            <strong>User Roles:</strong> Manage access, permissions, and workflows.
          </li>
          <li className={styles.capabilityItem}>
            <strong>Compliance Settings:</strong> GDPR compliance, language, and regional settings.
          </li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 Finish Goods Management System. Built with ❤️ in India.</p>
      </footer>
    </div>
  );
};

export default IMSPage;
