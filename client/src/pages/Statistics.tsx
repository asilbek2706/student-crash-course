interface StatisticsProps {
  statistics: {
    total: number;
    todayPresent: number;
    todayAbsent: number;
    taskCompleted: number;
    taskNotCompleted: number;
  };
}

const Statistics = ({ statistics }: StatisticsProps) => {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">👥</div>

        <div className="stat-info">
          <span>Jami talabalar</span>
          <strong>{statistics.total}</strong>
        </div>
      </div>

      <div className="stat-card success">
        <div className="stat-icon">✓</div>

        <div className="stat-info">
          <span>Bugun kelgan</span>
          <strong>{statistics.todayPresent}</strong>
        </div>
      </div>

      <div className="stat-card danger">
        <div className="stat-icon">×</div>

        <div className="stat-info">
          <span>Bugun kelmagan</span>
          <strong>{statistics.todayAbsent}</strong>
        </div>
      </div>

      <div className="stat-card primary">
        <div className="stat-icon">✓</div>

        <div className="stat-info">
          <span>Vazifani bajargan</span>
          <strong>{statistics.taskCompleted}</strong>
        </div>
      </div>

      <div className="stat-card warning">
        <div className="stat-icon">!</div>

        <div className="stat-info">
          <span>Vazifani bajarmagan</span>
          <strong>{statistics.taskNotCompleted}</strong>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
