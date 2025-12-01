import { ArrowRight, BarChart3, Brain, Target, Zap, CheckCircle, TrendingUp, Eye } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#ffffff',
      minHeight: '100vh',
      overflow:'scroll'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #2b2154 0%, #4c3d7a 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Eye size={24} color="#ffffff" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
              Visibility AI
            </span>
          </div>
          <button style={{
            padding: '12px 28px',
            background: '#2b2154',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1e1740'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2b2154'}
          >
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #faf9fc 0%, #ffffff 100%)',
        padding: '80px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }}></div>
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '60px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: 'rgba(43, 33, 84, 0.1)',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#2b2154',
                marginBottom: '24px',
              }}>
                AI SEARCH ANALYTICS
              </div>
              <h1 style={{
                fontSize: '52px',
                fontWeight: '800',
                color: '#111827',
                margin: '0 0 20px 0',
                lineHeight: '1.1',
                letterSpacing: '-1.5px',
              }}>
                Own Your Presence in <span style={{ 
                  background: 'linear-gradient(135deg, #2b2154 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>AI Results</span>
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0 0 32px 0',
                maxWidth: '540px',
              }}>
                Track, analyze, and optimize how your products appear across ChatGPT, Perplexity, Gemini, and other AI platforms. Stay ahead in the AI-powered search era.
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button style={{
                  padding: '16px 32px',
                  background: '#2b2154',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1e1740';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2b2154';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  Start Free Trial
                  <ArrowRight size={20} />
                </button>
                <button style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#2b2154',
                  border: '2px solid #2b2154',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(43, 33, 84, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}>
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Placeholder for Hero Image */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(43, 33, 84, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
              borderRadius: '16px',
              padding: '40px',
              border: '2px dashed #d1d5db',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              [Hero Product Screenshot]
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 40px',
        background: '#2b2154',
        color: '#ffffff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '60px',
            textAlign: 'center',
          }}>
            {[
              { number: '10B+', label: 'AI Searches Monthly' },
              { number: '67%', label: 'Users Trust AI Results' },
              { number: '5+', label: 'AI Platforms Tracked' },
              { number: '24/7', label: 'Real-Time Monitoring' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '40px', fontWeight: '700', marginBottom: '10px', color: '#a78bfa' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 16px 0',
              letterSpacing: '-1.2px',
            }}>
              Everything You Need to Dominate AI Search
            </h2>
            <p style={{ fontSize: '17px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Comprehensive analytics and insights to optimize your brand's AI visibility
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                icon: <BarChart3 size={32} />,
                title: 'Multi-Platform Analytics',
                desc: 'Track your visibility across ChatGPT, Perplexity, Gemini, Claude, and more in one unified dashboard.',
              },
              {
                icon: <Brain size={32} />,
                title: 'AI-Powered Insights',
                desc: 'Get actionable recommendations to improve your rankings and visibility in AI-generated responses.',
              },
              {
                icon: <Target size={32} />,
                title: 'Competitor Tracking',
                desc: 'Monitor how your competitors appear in AI results and identify opportunities to outperform them.',
              },
              {
                icon: <Zap size={32} />,
                title: 'Real-Time Alerts',
                desc: 'Receive instant notifications when your brand visibility changes or new opportunities arise.',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Performance Trends',
                desc: 'Visualize your AI visibility over time with detailed charts and historical data analysis.',
              },
              {
                icon: <CheckCircle size={32} />,
                title: 'Citation Tracking',
                desc: 'See exactly when and how AI platforms cite your content, products, or brand in their responses.',
              },
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '32px',
                background: '#fafbfc',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(43, 33, 84, 0.15)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #2b2154 0%, #4c3d7a 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 10px 0',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(180deg, #faf9fc 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 16px 0',
              letterSpacing: '-1.2px',
            }}>
              See Visibility AI in Action
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '32px' }}>
            {/* Dashboard Preview */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(43, 33, 84, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
              borderRadius: '16px',
              padding: '50px',
              border: '2px dashed #d1d5db',
              minHeight: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              [Dashboard Screenshot - Analytics Overview]
            </div>

            {/* Two Column Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(43, 33, 84, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                borderRadius: '16px',
                padding: '50px',
                border: '2px dashed #d1d5db',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '16px',
                fontWeight: '600',
              }}>
                [Insights Screenshot]
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(43, 33, 84, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
                borderRadius: '16px',
                padding: '50px',
                border: '2px dashed #d1d5db',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '16px',
                fontWeight: '600',
              }}>
                [Competitor Analysis]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 40px',
        background: 'linear-gradient(135deg, #2b2154 0%, #1e1740 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
        }}></div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '44px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            letterSpacing: '-1.2px',
          }}>
            Ready to Dominate AI Search?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 36px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Join leading brands who are already optimizing their AI visibility
          </p>
          <button style={{
            padding: '18px 40px',
            background: '#ffffff',
            color: '#2b2154',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
          }}>
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '50px 40px',
        background: '#111827',
        color: '#ffffff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '60px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#2b2154',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Eye size={20} color="#ffffff" />
                </div>
                <span style={{ fontSize: '20px', fontWeight: '700' }}>Visibility AI</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                AI search analytics for modern marketing teams
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Features', 'Pricing', 'Demo', 'Updates'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Privacy', 'Terms', 'Security'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            © 2024 Visibility AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}