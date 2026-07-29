// ponytail: Unused React import removed.
import { Shield, Lock, FileText, Scale, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-3 text-brand-primary">
        <Icon className="h-6 w-6" />
        <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
      </div>
      <div className="text-slate-600 font-medium leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function Legal() {
  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:py-24 overflow-hidden">
      <div className="bg-glow-mesh" />
      
      <div className="mx-auto max-w-4xl space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-4"
          >
            <Shield className="h-8 w-8" />
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Legal <span className="text-gradient">Center</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Last Updated: May 2026. Please read our terms and policies carefully before using the Careos Registry.
          </p>
        </div>

        <div className="glass-card rounded-[40px] p-8 lg:p-12 space-y-12">
          
          <Section title="Medical Disclaimer" icon={Heart}>
            <p>
              Careos is a <strong>platform for connecting families with care professionals</strong>. Careos is not a healthcare provider, home health agency, or medical facility. We do not provide medical advice, diagnosis, or treatment.
            </p>
            <p>
              The information provided by caregivers on their profiles is self-reported and verified by our registry team to the best of our ability. However, users are encouraged to perform their own due diligence before booking a care session.
            </p>
          </Section>

          <Section title="Terms of Service" icon={FileText}>
            <p>
              By accessing the Careos Registry, you agree to comply with all local, state, and federal laws regarding home care and private nursing.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must be 18 years or older.</li>
              <li>Caregivers must provide truthful and accurate credentials.</li>
              <li>Booking through the platform constitutes a direct contract between the Family and the Professional.</li>
              <li>Careos is not responsible for the clinical outcomes of any session.</li>
            </ul>
          </Section>

          <Section title="Privacy & Data Protection" icon={Lock}>
            <p>
              We value your privacy. Patient data and clinical requirements shared during the booking process are strictly confidential and shared only with the selected caregiver.
            </p>
            <p>
              We do not sell user data to third parties. All clinical registry documents (licenses, IDs) are stored securely and used only for verification purposes by the Careos administrative team.
            </p>
          </Section>

          <Section title="Limitation of Liability" icon={Scale}>
            <p>
              In no event shall Careos, its founders, or affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services.
            </p>
            <p>
              The platform is provided "as is" without any warranties of any kind, either express or implied, including but not limited to the clinical competency of the registry members.
            </p>
          </Section>

        </div>

        <div className="text-center">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            Built for trust by Careos Administrative Registry
          </p>
        </div>
      </div>
    </div>
  );
}
