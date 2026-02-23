import Image from 'next/image'
import Link from 'next/link'

import { Settings } from '@/types/settings'

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="flex flex-col gap-4 px-4 py-6 lg:px-8">
        {/* Disclaimer */}
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="font-semibold text-foreground">Disclaimer:</strong> The information in this site and any attachments (such as scripts, sample codes, etc.) is provided AS-IS and WITH ALL FAULTS. Pricing estimates are for demonstration purposes only and do not reflect final pricing. Microsoft assumes no liability for your use of this information and makes no guarantees or warranties, expressed or implied, regarding its accuracy or completeness, including any pricing details.
          </p>
        </div>
        
        {/* Footer bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground sm:justify-between sm:gap-0">
          <p className="items-center">
            &copy; {new Date().getFullYear()}{' '}
            <Link
              title={Settings.name}
              aria-label={Settings.name}
              className="font-semibold"
              href={Settings.link}
            >
              {Settings.name}
            </Link>
            .
          </p>
          {Settings.branding !== false && (
            <div className="hidden items-center md:block">
              <Link
                className="font-semibold"
                href="https://rubixstudios.com.au"
                title="Rubix Studios"
                aria-label="Rubix Studios"
                target="_blank"
              >
                <Image
                  src="/logo.svg"
                  alt="Rubix Studios logo"
                  title="Rubix Studios logo"
                  aria-label="Rubix Studios logo"
                  priority={false}
                  width={30}
                  height={30}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
