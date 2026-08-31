import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import './App.css'

const caseTitles = [
  '배우자 외도 관련 이혼소송',
  '상간녀 손해배상 청구소송',
  '배우자 부정행위 이혼소송',
  '상간녀 위자료 청구소송',
  '배우자 외도 증거 관련 소송',
  '상간녀 부정행위 손해배상',
  '외도로 인한 이혼 및 위자료',
  '배우자 외도 상간녀 소송',
]

const awards = [1, 2, 3, 4, 5]
const rollingKeywords = ['증거수집', '사실확인', '현장확인']
const mapPoints = [
  [52.3, 94.5],
  [63.8, 89.7],
  [65.3, 80.0],
  [76.0, 75.8],
  [85.7, 78.7],
  [88.5, 70.9],
  [82.0, 64.3],
  [67.6, 67.9],
  [87.6, 58.7],
  [70.3, 54.4],
  [64.5, 47.6],
  [73.6, 44.2],
  [75.8, 41.4],
  [66.8, 31.8],
  [73.8, 27.4],
  [83.7, 25.2],
]

const reasons = [
  {
    icon: '/images/reason-strategy.png',
    title: '법적 메커니즘을 꿰뚫는 결정적 증거수집',
    description: '실전 노하우를 바탕으로 소송의 판도를 바꾸는 확실한 전문 조력자가 되어드립니다.',
  },
  {
    icon: '/images/reason-consultation.png',
    title: '단순 정보 수집을 넘어선 전략적 대응',
    description: '현장에서 직접 확보한 명확한 물증과 함께, 사전 해결을 위한 최적의 법리 방향성까지 제시합니다.',
  },
  {
    icon: '/images/reason-step-3.svg',
    title: '단 2~3일, 불안을 확신으로 바꾸는 압도적 속도',
    description: '조급함과 불안 속에서 벗어날 수 있도록, 의뢰 즉시 착수하여 신속하게 결과를 전달합니다.',
  },
  {
    icon: '/images/reason-speed.png',
    title: '간편하고 신속한 온라인 상담',
    description: '직접 찾아오지 않으셔도 되는 온라인 상담으로 부담을 덜어드립니다.',
  },
]

const steps = [
  {
    title: '민간조사 의뢰검토',
    description: '사건·영상 촬영 / 동선 관찰 / 지속적 만남 여부 / 숙박업소 출입 / 차량 동승 / 스킨십 등',
  },
  {
    title: '증거 확보',
    description: '사진·영상 확보 / 보유 자료 분석 / 증거 정리 / 사실관계 확인',
  },
  {
    title: '제휴 법무법인 무료상담',
    description: '이혼 상담 / 상간소송 검토 / 위자료 상담 / 법률 자문',
  },
  {
    title: '상간자 특정',
    description: '신원 확인 / 사실관계 확인 / 관계 파악 / 정보 확인',
  },
  {
    title: '내용증명',
    description: '법률 전문가 상담을 통한 내용증명 작성 / 관계 중단 요구 / 위자료 협의',
  },
  {
    title: '상간자 위자료 청구 소송',
    description: '증거 검토 / 위자료 청구 / 손해배상 청구 / 소송 진행',
  },
  {
    title: '이혼소송 병행 여부',
    description: '이혼 여부 검토 / 재산분할 / 양육권 상담 / 소송 진행',
  },
  {
    title: '해결 및 비밀유지',
    description: '사건 마무리 / 진행 결과 안내 / 사후 상담 / 철저한 비밀 유지 및 연구 폐기',
  },
]

const legalExperts = [
  {
    name: '서지원 변호사',
    image: '/images/naran-seo-jiwon-transparent.png',
    career: '대한변협 인증 형사법·부동산 전문변호사',
  },
  {
    name: '최지연 변호사',
    image: '/images/naran-choi-jiyeon-transparent.png',
    career: '서울도봉·강북경찰서 경미범죄 심사위원',
  },
  {
    name: '정이든 변호사',
    image: '/images/naran-jung-ideun-transparent.png',
    career: '대한변협 인증 부동산 전문변호사',
  },
  {
    name: '문인정 변호사',
    image: '/images/naran-moon-injeong-transparent.png',
    career: '대한변협 인증 형사법 전문변호사',
  },
  {
    name: '강수은 변호사',
    image: '/images/naran-kang-sueun-transparent.png',
    career: '상간 손해배상 사건 승소 수행 · 영어·일본어',
  },
  {
    name: '이정민 변호사',
    image: '/images/naran-lee-jungmin-transparent.png',
    career: '경기도교육청 교직원법률지원 변호사',
  },
  {
    name: '손수정 변호사',
    image: '/images/naran-son-sujeong-transparent.png',
    career: '대법원 국선변호인 · 경기도 법률상담위원',
  },
  {
    name: '황용상 고문',
    image: '/images/naran-hwang-yongsang.png',
    career: '경찰 재직 35년 · 수사업무 30년',
  },
]

type ConsultationForm = {
  name: string
  phone: string
  availableTime: string
  message: string
  privacy: boolean
  website: string
}

const initialForm: ConsultationForm = {
  name: '',
  phone: '',
  availableTime: '',
  message: '',
  privacy: false,
  website: '',
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="탐정법인 정성 홈">
      <img src="/images/logo-mark.png" alt="" />
      <span className="brand-korean">탐정법인</span>
      <span className="brand-english">JEONG<br />SEONG</span>
    </a>
  )
}

function ConsultationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.2a7.8 7.8 0 0 1-8 7.6 8.6 8.6 0 0 1-3.1-.6L4 20l1.5-4.3A7.3 7.3 0 0 1 4 11.2a7.8 7.8 0 0 1 8-7.6 7.8 7.8 0 0 1 8 7.6Z" />
      <path d="M8.5 11.2h.01M12 11.2h.01M15.5 11.2h.01" />
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g clipPath="url(#kakao-floating-clip)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0001 2.19995C6.20072 2.19995 1.5 5.83174 1.5 10.3109C1.5 13.0966 3.31815 15.5524 6.0868 17.0131L4.92188 21.2685C4.81896 21.6445 5.249 21.9443 5.57922 21.7264L10.6856 18.3562C11.1165 18.3978 11.5545 18.422 12.0001 18.422C17.7989 18.422 22.5 14.7904 22.5 10.3109C22.5 5.83174 17.7989 2.19995 12.0001 2.19995Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="kakao-floating-clip">
          <rect width="21" height="21" fill="white" transform="translate(1.5 1.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function getCaseDate(referenceDate: Date, daysAgo: number) {
  const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - daysAgo, 12)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return {
    dateTime: `${year}-${month}-${day}`,
    label: `${year}.${month}.${day}`,
  }
}

function AnimatedNumber({ value, duration = 1600 }: { value: number, duration?: number }) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? value : 0
  ))

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let animationFrame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const startTime = performance.now()
      const update = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(value * easedProgress))

        if (progress < 1) animationFrame = requestAnimationFrame(update)
      }

      animationFrame = requestAnimationFrame(update)
      observer.disconnect()
    }, { threshold: 0.55 })

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [duration, value])

  return <span ref={elementRef} className="count-up">{displayValue.toLocaleString('ko-KR')}</span>
}

function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('motion-ready')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [])
}

function App() {
  const [form, setForm] = useState<ConsultationForm>(initialForm)
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [rollingKeywordIndex, setRollingKeywordIndex] = useState(0)
  const [caseDateReference, setCaseDateReference] = useState(() => new Date())
  const expertTrackRef = useRef<HTMLDivElement>(null)
  const expertResetTimerRef = useRef<number | null>(null)
  const processTrackRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useScrollReveal()

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    let retryArmed = false
    let isDisposed = false

    const disarmInteractionRetry = () => {
      if (!retryArmed) return
      retryArmed = false
      window.removeEventListener('pointerdown', retryOnFirstInteraction)
      window.removeEventListener('touchstart', retryOnFirstInteraction)
    }

    const retryOnFirstInteraction = () => {
      disarmInteractionRetry()
      video.muted = true
      void video.play().catch(() => undefined)
    }

    const armInteractionRetry = () => {
      if (retryArmed || isDisposed) return
      retryArmed = true
      window.addEventListener('pointerdown', retryOnFirstInteraction, { passive: true })
      window.addEventListener('touchstart', retryOnFirstInteraction, { passive: true })
    }

    const attemptPlayback = () => {
      video.muted = true
      void video.play()
        .then(disarmInteractionRetry)
        .catch(() => {
          if (video.paused) armInteractionRetry()
        })
    }

    const handleCanPlay = () => {
      if (video.paused) attemptPlayback()
    }

    video.addEventListener('canplay', handleCanPlay)
    attemptPlayback()

    return () => {
      isDisposed = true
      video.removeEventListener('canplay', handleCanPlay)
      disarmInteractionRetry()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setRollingKeywordIndex((current) => (current + 1) % rollingKeywords.length)
    }, 2400)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => setCaseDateReference(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const caseRows = caseTitles.map((title, index) => ({
    title,
    ...getCaseDate(caseDateReference, index),
  }))

  const goToConsultation = () => {
    document.querySelector('#consultation')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollExperts = useCallback(() => {
    const track = expertTrackRef.current
    const card = track?.querySelector<HTMLElement>('article')
    if (!track || !card) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
    const step = card.offsetWidth + gap
    const currentIndex = Math.round(track.scrollLeft / step) % legalExperts.length
    const nextIndex = currentIndex + 1

    track.scrollTo({ left: nextIndex * step, behavior: 'smooth' })

    if (nextIndex === legalExperts.length) {
      expertResetTimerRef.current = window.setTimeout(() => {
        track.classList.add('is-loop-resetting')
        track.scrollTo({ left: 0, behavior: 'auto' })
        void track.offsetWidth
        track.classList.remove('is-loop-resetting')
      }, 650)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      const track = expertTrackRef.current
      if (!track || document.hidden || track.matches(':hover')) return
      scrollExperts()
    }, 1500)

    return () => {
      window.clearInterval(interval)
      if (expertResetTimerRef.current !== null) window.clearTimeout(expertResetTimerRef.current)
    }
  }, [scrollExperts])

  const scrollProcess = useCallback((direction: -1 | 1) => {
    const track = processTrackRef.current
    const card = track?.querySelector<HTMLElement>('article')
    if (!track || !card) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
    const maxScroll = track.scrollWidth - track.clientWidth
    const isAtStart = track.scrollLeft <= 4
    const isAtEnd = track.scrollLeft >= maxScroll - 4
    const nextPosition = direction > 0 && isAtEnd
      ? 0
      : direction < 0 && isAtStart
        ? maxScroll
        : track.scrollLeft + direction * (card.offsetWidth + gap)

    track.scrollTo({
      left: nextPosition,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      const track = processTrackRef.current
      if (!track || document.hidden || track.matches(':hover') || track.contains(document.activeElement)) return
      scrollProcess(1)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [scrollProcess])

  const submitConsultation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.privacy) {
      setSubmitState('error')
      setSubmitMessage('개인정보 처리방침에 동의해 주세요.')
      return
    }

    setSubmitState('loading')
    setSubmitMessage('')

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json() as { message?: string }

      if (!response.ok) {
        throw new Error(result.message || '상담 접수 중 문제가 발생했습니다.')
      }

      setSubmitState('success')
      setSubmitMessage(result.message || '상담이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.')
      setForm(initialForm)
    } catch (error) {
      setSubmitState('error')
      setSubmitMessage(error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <main id="top">
      <header className="site-header">
        <div className="header-inner page-shell">
          <div className="header-brand-block">
            <Brand />
            <p className="header-tagline">대한민국 외도 증거 수집 전문 | 탐정법인 정성</p>
          </div>
          <div className="header-trust-marks">
            <img className="header-award-badge" src="/images/award-badge.png" alt="2024 대한민국 소비자평가 1위 브랜드 대상" />
          </div>
        </div>
      </header>

      <section className="hero-section page-shell" aria-labelledby="hero-title" data-reveal="scale">
        <div className="hero-card">
          <video
            ref={heroVideoRef}
            className="hero-background"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            preload="auto"
            aria-hidden="true"
          >
            <source src="/images/building.mp4" type="video/mp4" />
          </video>
          <div className="hero-content">
            <p className="eyebrow">외도 증거수집 전문 탐정법인</p>
            <h1 id="hero-title">
              <span className="hero-title-line hero-title-line-top">
                <span className="rolling-window" aria-label={rollingKeywords[rollingKeywordIndex]}>
                  <span className="rolling-keyword" key={rollingKeywords[rollingKeywordIndex]} aria-hidden="true">{rollingKeywords[rollingKeywordIndex]}</span>
                </span>
                <span>, 소송까지</span>
              </span>
              <span className="hero-title-line hero-title-line-bottom">확실하게 시작하기</span>
            </h1>
            <p className="hero-description">오직 배우자의 외도와 불륜 사건만을 집요하게 파고드는 외도 전문 탐정법인</p>
            <div className="hero-actions">
              <button className="button button-secondary" type="button" onClick={goToConsultation}>원클릭 상담</button>
            </div>
          </div>
          <div className="hero-metrics" aria-label="주요 실적">
            <div><strong>상담건수</strong><span><b><AnimatedNumber value={15087} /></b> +</span></div>
            <div><strong>만족도</strong><span><b><AnimatedNumber value={98} /></b> %</span></div>
          </div>
        </div>
      </section>

      <section className="experience-section section" aria-labelledby="experience-title">
        <div className="page-shell">
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">PROVEN EXPERIENCE</p>
            <h2 id="experience-title">수많은 증거수집 경험</h2>
            <p>신뢰할 수 있는 경력의 전문가들이 팀을 꾸려<br />효과적으로 증거를 수집하며 해결하고 있습니다.</p>
          </div>
          <div className="proof-cards" data-reveal="up">
            <article style={{ backgroundImage: "url('/images/proof-handshake.webp')" }}>
              <span>만족도</span><strong><AnimatedNumber value={98} />%</strong>
            </article>
            <article style={{ backgroundImage: "url('/images/proof-office.webp')" }}>
              <span>진행건수</span><strong><AnimatedNumber value={15087} />+</strong>
            </article>
          </div>
          <div className="case-board" data-reveal="up">
            <div className="case-board-title"><strong>의뢰 사건 진행목록</strong><span>날짜</span></div>
            <div className="case-board-list-window" aria-label="최근 의뢰 사건 진행목록">
              <ul className="case-board-list-track">
                {[...caseRows, ...caseRows].map(({ title, dateTime, label }, index) => (
                  <li key={`${title}-${index}`} aria-hidden={index >= caseRows.length}>
                    <span>{title}</span>
                    <time dateTime={dateTime}>{label}</time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="experts-section section" aria-labelledby="experts-title">
        <div className="page-shell">
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">LEGAL ADVISORY PARTNERS</p>
            <h2 id="experts-title">함께하는 법률 전문가</h2>
            <p>전문 변호사와 고문이 함께합니다.</p>
          </div>
          <div className="experts-carousel" data-reveal="up" role="region" aria-roledescription="carousel" aria-label="변호사 및 고문 소개">
            <div className="experts-track" ref={expertTrackRef}>
              {[...legalExperts, ...legalExperts].map((expert, index) => {
                const isDuplicate = index >= legalExperts.length

                return (
                  <article
                    className={expert.name.endsWith('고문') ? 'expert-card advisor' : 'expert-card'}
                    key={`${expert.name}-${index}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={isDuplicate ? undefined : `${index + 1} / ${legalExperts.length}`}
                    aria-hidden={isDuplicate}
                  >
                    <img src={expert.image} alt={isDuplicate ? '' : expert.name} />
                    <div className="expert-card-copy">
                      <h3>{expert.name}</h3>
                      <p>{expert.career}</p>
                    </div>
                  </article>
                )
              })}
            </div>
            
          </div>
        </div>
      </section>

      <section className="coverage-section section" aria-labelledby="coverage-title">
        <div className="page-shell coverage-grid">
          <div className="section-copy" data-reveal="left">
            <p className="section-kicker">전국조사현황</p>
            <h2 id="coverage-title">단순한 증거 수집이 아닙니다</h2>
            <p>승소 가능성을 고려한 전략형 증거 설계를 진행합니다.</p>
            <div className="coverage-numbers">
              <p>시 / 군 / 구 지역수 <strong><AnimatedNumber value={120} /><sup>+</sup></strong></p>
              <p>서울특별시 · 경기도 외 전국지역 <strong><AnimatedNumber value={42} /><sup>%</sup></strong></p>
            </div>
            <p className="muted">법과 정성이 만날 때, 감춰진 진실이 드러납니다.</p>
          </div>
          <div className="coverage-map-visual" data-reveal="right">
            <img className="coverage-map" src="/images/coverage-map.webp" alt="전국 조사 지역 분포 지도" />
            <div className="map-points" aria-hidden="true">
              {mapPoints.map(([left, top], index) => (
                <span
                  key={`${left}-${top}`}
                  style={{ left: `${left}%`, top: `${top}%`, '--point-delay': `${(index % 6) * 180}ms` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="insight-section section" aria-labelledby="insight-title">
        <div className="page-shell">
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">TRUSTED RECORD</p>
            <h2 id="insight-title">탐정법인 정성 INSIGHT</h2>
          </div>
          <div className="insight-grid" data-reveal="up">
            <img src="/images/스크린샷 2026-08-27 144609.png" alt="탐정법인 정성 핀테크 분야 특화 전담 부서 운영 경북신문 기사" />
            <article>
              <span>NEWS</span>
              <h3><a href="https://www.kbsm.net/news/view.php?idx=456482" target="_blank" rel="noreferrer">[경북신문] 탐정법인 정성, 핀테크 분야 특화 전담 부서 운영으로 피해 복구 앞장</a></h3>
              <p>탐정법인 정성이 핀테크 사기 전담 부서를 통해 투자 사기 피해 복구와 예방을 위한 맞춤형 조사·증거 수집을 지원합니다.</p>
              <time dateTime="2024-12-05">2024.12.05</time>
            </article>
          </div>
          <div className="insight-grid" data-reveal="up">
            <img src="/images/press.webp" alt="탐정사무소 정성 소비자 선호 브랜드 수상 보도자료" />
            <article>
              <span>NEWS</span>
              <h3>[이뉴스투데이] “대한민국 소비자 선호 브랜드 1위” 수상</h3>
              <p>탐정사무소 정성 대표는 “진심으로 감사드리며 더 나은 미래를 함께 만들어가겠다”고 수상 소감을 전했습니다.</p>
              <time dateTime="2024-10-15">2024.10.15</time>
            </article>
          </div>
          <div className="award-marquee" data-reveal="up" aria-label="탐정법인 정성 수상 인증">
            <div className="award-track">
              {[...awards, ...awards].map((award, index) => (
                <img
                  key={`${award}-${index}`}
                  src={`/images/award-${award}.webp`}
                  alt={index < awards.length ? `탐정법인 정성 수상 인증 ${award}` : ''}
                  aria-hidden={index >= awards.length}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reasons-section section" aria-labelledby="reasons-title">
        <div className="page-shell">
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">WHY JEONG SEONG</p>
            <h2 id="reasons-title">정성과 함께 하셔야하는 이유</h2>
            <p>아직 고민되시나요?</p>
          </div>
          <div className="reason-list">
            {reasons.map((reason, index) => (
              <article key={reason.title} data-reveal="left" style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
                <img src={reason.icon} alt="" />
                <div><h3>{reason.title}</h3><p>{reason.description}</p></div>
              </article>
            ))}
          </div>
          <button className="button button-blue" type="button" onClick={goToConsultation} data-reveal="up">상담 접수 바로가기</button>
        </div>
      </section>

      <section className="process-section section" aria-labelledby="process-title">
        <div className="page-shell">
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">PROCESS</p>
            <h2 id="process-title">이렇게 진행됩니다</h2>
            <p>논스톱 해결 진행 정성은 가능합니다!</p>
          </div>
          <div className="process-carousel" data-reveal="up" role="region" aria-roledescription="carousel" aria-label="진행 절차">
            <div className="process-track" ref={processTrackRef} tabIndex={0}>
              {steps.map((step, index) => (
                <article key={step.title} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${steps.length}`}>
                  <div className="step-image"><img src={`/images/step-${index + 1}.webp`} alt="" /><span>{index + 1}</span></div>
                  <div className="step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
                </article>
              ))}
            </div>
            <div className="process-carousel-controls">
              <button type="button" onClick={() => scrollProcess(-1)} aria-label="이전 진행 단계">←</button>
              <span>옆으로 넘겨 확인하세요</span>
              <button type="button" onClick={() => scrollProcess(1)} aria-label="다음 진행 단계">→</button>
            </div>
          </div>
        </div>
      </section>

      <section id="consultation" className="consultation-section section" aria-labelledby="consultation-title">
        <div className="page-shell">
          <div data-reveal="left"><Brand /></div>
          <div className="section-heading centered" data-reveal="up">
            <p className="section-kicker">PRIVATE CONSULTATION</p>
            <h2 id="consultation-title">확실한 결과 정성이 책임집니다</h2>
          </div>
          <div className="chat-bubbles" aria-hidden="true">
            <p data-reveal="left">탐정법인 정성입니다.<br />무엇을 도와드릴까요?</p>
            <p data-reveal="right" style={{ '--reveal-delay': '140ms' } as CSSProperties}>심증은 있는데… 물증이 없어요.<br />가능할까요?</p>
          </div>
          <form className="consultation-form" onSubmit={submitConsultation} data-reveal="up">
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">웹사이트</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></div>
            <label><span>이름</span><input required maxLength={30} autoComplete="name" placeholder="성함을 입력해주세요." value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label><span>연락처</span><input required maxLength={20} inputMode="tel" autoComplete="tel" placeholder="연락처를 입력해주세요. (숫자만 입력)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label><span>상담가능시간</span><select required value={form.availableTime} onChange={(event) => setForm({ ...form, availableTime: event.target.value })}><option value="">상담 가능한 시간을 선택해주세요.</option><option>오전 9시 ~ 12시</option><option>오후 12시 ~ 3시</option><option>오후 3시 ~ 6시</option><option>오후 6시 이후</option><option>언제든지 가능</option></select></label>
            <label className="message-row"><span>문의내용</span><textarea required maxLength={1000} placeholder="문의 내용을 입력해주세요." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
            <label className="privacy-row"><input type="checkbox" checked={form.privacy} onChange={(event) => setForm({ ...form, privacy: event.target.checked })} /><span>개인정보처리방침 및 철저한 비밀유지 서약에 동의합니다. <b>(필수)</b></span></label>
            <button className="button submit-button" type="submit" disabled={submitState === 'loading'}>{submitState === 'loading' ? '안전하게 접수 중…' : '100% 비밀 보장 · 사건 접수하기'}</button>
            <p className={`form-result ${submitState}`} role="status" aria-live="polite">{submitMessage}</p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell"><Brand /><p>상담 내용과 개인정보는 안전하게 보호됩니다.</p><small>© 2026 탐정법인 정성. All rights reserved.</small></div>
      </footer>

      <div className="floating-actions" aria-label="빠른 상담">
        <a
          className="floating-kakao"
          href="https://www.kakao.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="카카오 공식 홈페이지 열기"
        >
          <KakaoIcon />
        </a>
        <button className="floating-consultation" type="button" onClick={goToConsultation} aria-label="원클릭 상담 신청 영역으로 이동">
          <span className="floating-consultation-icon"><ConsultationIcon /></span>
        </button>
      </div>
    </main>
  )
}

export default App
