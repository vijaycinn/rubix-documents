import { Link } from 'lib/transition'
import { buttonVariants } from '@/components/ui/button'
import { FaCheckCircle, FaShieldAlt, FaChartBar, FaBolt, FaClock, FaDollarSign } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="flex min-h-[90vh] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <FaShieldAlt className="h-4 w-4" />
          CJIS Compliant Architecture
        </div>

        <h1 className="mb-4 text-4xl font-bold sm:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          CJN Dakota County
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-muted-foreground sm:text-3xl lg:text-4xl">
          Records Management System
        </h2>
        <p className="mb-12 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Azure modernization documentation, architectural recommendations, and interactive implementation tracking
          for the Dakota County Records Management System.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/docs/priority-matrix"
            className={buttonVariants({ className: 'px-8 py-6 text-lg', size: 'lg' })}
          >
            <FaCheckCircle className="mr-2 h-5 w-5" />
            Priority Matrix
          </Link>
          <Link
            href="/docs/architecture"
            className={buttonVariants({ className: 'px-8 py-6 text-lg', size: 'lg', variant: 'outline' })}
          >
            <FaChartBar className="mr-2 h-5 w-5" />
            Architecture Guide
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <FaShieldAlt className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Security First</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CJIS compliant architecture with managed identities, TDE encryption, and comprehensive audit logging for law enforcement data protection
            </p>
          </div>

          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Track Progress</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interactive priority matrix with 22 recommendations organized by urgency. Check off items as you complete them
            </p>
          </div>

          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FaBolt className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Well-Architected</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on Azure Well-Architected Framework covering security, reliability, performance, operations, and cost optimization
            </p>
          </div>

          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaClock className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Phased Implementation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organized roadmap spanning 0-90+ days with clear timelines, effort estimates, and prioritization for each recommendation
            </p>
          </div>

          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <FaDollarSign className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Cost Optimization</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Detailed cost analysis with savings opportunities through reserved instances, storage lifecycle management, and auto-scaling
            </p>
          </div>

          <div className="group rounded-xl border bg-card p-6 text-card-foreground shadow-sm hover:shadow-lg transition-all hover:border-primary/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
              <FaChartBar className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Real-Time Tracking</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SQLite-backed persistence ensures your implementation progress is saved automatically and available across sessions
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
