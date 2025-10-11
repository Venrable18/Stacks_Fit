;; StacksFit V2 - Simplified but Complete Smart Contract
;; Enhanced fitness tracking with batch operations for lightning-fast dashboard

;; ============================================================================
;; CONSTANTS AND ERRORS
;; ============================================================================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u100))
(define-constant ERR-NOT-FOUND (err u101))
(define-constant ERR-INVALID-INPUT (err u102))
(define-constant ERR-ALREADY-EXISTS (err u103))
(define-constant ERR-INVALID-DATE (err u104))

;; ============================================================================
;; DATA VARIABLES
;; ============================================================================

(define-data-var contract-paused bool false)
(define-data-var points-per-step uint u1)
(define-data-var last-user-id uint u0)

;; ============================================================================
;; DATA MAPS
;; ============================================================================

;; User profile with enhanced fields
(define-map user-profiles principal {
  user-id: uint,
  display-name: (string-ascii 50),
  age: uint,
  goals: (string-ascii 200),
  created-at: uint,
  is-premium: bool,
  total-points: uint,
  level: uint,
  achievements-count: uint
})

;; Enhanced daily progress tracking
(define-map daily-progress { user: principal, date: uint } {
  steps: uint,
  calories-burned: uint,
  active-time: uint,
  distance: uint,
  calories-consumed: uint,
  protein: uint,
  carbs: uint,
  fats: uint,
  water-ml: uint,
  workout-type: (string-ascii 30),
  workout-duration: uint,
  workout-intensity: uint,
  mood-rating: uint,
  notes: (string-ascii 200),
  created-timestamp: uint,
  is-verified: bool
})

;; User statistics for dashboard
(define-map user-stats principal {
  total-steps: uint,
  total-calories-burned: uint,
  total-workouts: uint,
  current-streak: uint,
  longest-streak: uint,
  avg-daily-steps: uint,
  weekly-steps: uint,
  monthly-steps: uint,
  last-active-date: uint
})

;; Workout plans with IPFS integration
(define-map workout-plans uint {
  creator: principal,
  title: (string-ascii 100),
  description: (string-ascii 500),
  difficulty: (string-ascii 20),
  duration-weeks: uint,
  ipfs-hash: (string-ascii 100),
  created-at: uint,
  is-public: bool,
  likes-count: uint,
  completion-count: uint
})

;; Achievement system
(define-map user-achievements { user: principal, achievement-id: uint } {
  earned-timestamp: uint,
  progress-value: uint,
  celebration-shared: bool
})

;; Social features - friendships
(define-map friendships { user1: principal, user2: principal } {
  created-timestamp: uint,
  interaction-count: uint,
  is-active: bool
})

;; ============================================================================
;; READ-ONLY FUNCTIONS
;; ============================================================================

;; Get current date (simplified)
(define-read-only (get-current-date)
  (/ stacks-block-height u144))  ;; Approximately 1 day per 144 blocks

;; Get current timestamp
(define-read-only (get-current-timestamp)
  stacks-block-height)

;; Validate date
(define-read-only (is-valid-date (date uint))
  (and (> date u0) (<= date (get-current-date))))

;; Get user profile
(define-read-only (get-user-profile (user principal))
  (map-get? user-profiles user))

;; Get daily progress
(define-read-only (get-daily-progress (user principal) (date uint))
  (map-get? daily-progress { user: user, date: date }))

;; BATCH DASHBOARD FUNCTIONS - Lightning Fast Data Loading
;; ========================================================

;; Get comprehensive dashboard data in one call
(define-read-only (get-dashboard-data-v2 (user principal))
  (let ((profile (map-get? user-profiles user))
        (stats (map-get? user-stats user))
        (today (get-current-date))
        (today-progress (map-get? daily-progress { user: user, date: today }))
        (yesterday-progress (map-get? daily-progress { user: user, date: (- today u1) }))
        (week-ago-progress (map-get? daily-progress { user: user, date: (- today u7) })))
    {
      profile: profile,
      stats: stats,
      today-progress: today-progress,
      yesterday-progress: yesterday-progress,
      week-ago-progress: week-ago-progress,
      current-date: today,
      has-data: (is-some profile)
    }))

;; Get weekly progress summary
(define-read-only (get-weekly-summary-v2 (user principal))
  (let ((today (get-current-date)))
    {
      week-start: (- today u7),
      week-end: today,
      day1: (map-get? daily-progress { user: user, date: (- today u7) }),
      day2: (map-get? daily-progress { user: user, date: (- today u6) }),
      day3: (map-get? daily-progress { user: user, date: (- today u5) }),
      day4: (map-get? daily-progress { user: user, date: (- today u4) }),
      day5: (map-get? daily-progress { user: user, date: (- today u3) }),
      day6: (map-get? daily-progress { user: user, date: (- today u2) }),
      day7: (map-get? daily-progress { user: user, date: (- today u1) }),
      today: (map-get? daily-progress { user: user, date: today })
    }))

;; Get user achievements
(define-read-only (get-user-achievements-v2 (user principal))
  {
    achievement-1: (map-get? user-achievements { user: user, achievement-id: u1 }),
    achievement-2: (map-get? user-achievements { user: user, achievement-id: u2 }),
    achievement-3: (map-get? user-achievements { user: user, achievement-id: u3 }),
    achievement-4: (map-get? user-achievements { user: user, achievement-id: u4 }),
    achievement-5: (map-get? user-achievements { user: user, achievement-id: u5 }),
    total-count: (default-to u0 (get achievements-count (map-get? user-profiles user)))
  })

;; Get social data
(define-read-only (get-social-data-v2 (user principal))
  {
    has-friends: false,
    friend-count: u0,
    active-challenges: u0
  })

;; ============================================================================
;; PUBLIC FUNCTIONS
;; ============================================================================

;; Create or update user profile
(define-public (create-profile-v2 
  (display-name (string-ascii 50))
  (age uint)
  (goals (string-ascii 200)))
  
  (let ((user tx-sender)
        (current-time (get-current-timestamp))
        (new-user-id (+ (var-get last-user-id) u1)))
    
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR-UNAUTHORIZED)
    (asserts! (> (len display-name) u0) ERR-INVALID-INPUT)
    (asserts! (and (>= age u13) (<= age u120)) ERR-INVALID-INPUT)
    
    ;; Create profile
    (map-set user-profiles user {
      user-id: new-user-id,
      display-name: display-name,
      age: age,
      goals: goals,
      created-at: current-time,
      is-premium: false,
      total-points: u0,
      level: u1,
      achievements-count: u0
    })
    
    ;; Initialize stats
    (map-set user-stats user {
      total-steps: u0,
      total-calories-burned: u0,
      total-workouts: u0,
      current-streak: u0,
      longest-streak: u0,
      avg-daily-steps: u0,
      weekly-steps: u0,
      monthly-steps: u0,
      last-active-date: (get-current-date)
    })
    
    ;; Update user ID counter
    (var-set last-user-id new-user-id)
    
    (ok new-user-id)))

;; Record comprehensive daily progress
(define-public (record-progress-v2
  (date uint)
  (steps uint)
  (calories-burned uint)
  (active-time uint)
  (distance uint)
  (calories-consumed uint)
  (protein uint)
  (carbs uint)
  (fats uint)
  (water-ml uint)
  (workout-type (string-ascii 30))
  (workout-duration uint)
  (workout-intensity uint)
  (mood-rating uint)
  (notes (string-ascii 200)))
  
  (let ((user tx-sender)
        (current-time (get-current-timestamp))
        (progress-key { user: user, date: date }))
    
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR-UNAUTHORIZED)
    (asserts! (is-valid-date date) ERR-INVALID-INPUT)
    (asserts! (<= steps u200000) ERR-INVALID-INPUT)
    (asserts! (<= calories-burned u10000) ERR-INVALID-INPUT)
    (asserts! (<= active-time u1440) ERR-INVALID-INPUT)  ;; Max 24 hours
    (asserts! (<= workout-intensity u10) ERR-INVALID-INPUT)
    (asserts! (<= mood-rating u10) ERR-INVALID-INPUT)
    
    ;; Record progress
    (map-set daily-progress progress-key {
      steps: steps,
      calories-burned: calories-burned,
      active-time: active-time,
      distance: distance,
      calories-consumed: calories-consumed,
      protein: protein,
      carbs: carbs,
      fats: fats,
      water-ml: water-ml,
      workout-type: workout-type,
      workout-duration: workout-duration,
      workout-intensity: workout-intensity,
      mood-rating: mood-rating,
      notes: notes,
      created-timestamp: current-time,
      is-verified: true
    })
    
    ;; Update user stats
    (update-user-stats-v2 user steps calories-burned workout-duration)
    
    ;; Check achievements
    (check-achievements-v2 user steps calories-burned)
    
    ;; Award points
    (award-points-v2 user steps)
    
    (ok true)))

;; Create workout plan with IPFS
(define-public (create-workout-plan-v2
  (title (string-ascii 100))
  (description (string-ascii 500))
  (difficulty (string-ascii 20))
  (duration-weeks uint)
  (ipfs-hash (string-ascii 100))
  (is-public bool))
  
  (let ((user tx-sender)
        (current-time (get-current-timestamp))
        (plan-id current-time))  ;; Use timestamp as ID for simplicity
    
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR-UNAUTHORIZED)
    (asserts! (> (len title) u0) ERR-INVALID-INPUT)
    (asserts! (> (len ipfs-hash) u0) ERR-INVALID-INPUT)
    (asserts! (<= duration-weeks u52) ERR-INVALID-INPUT)  ;; Max 1 year
    
    ;; Create workout plan
    (map-set workout-plans plan-id {
      creator: user,
      title: title,
      description: description,
      difficulty: difficulty,
      duration-weeks: duration-weeks,
      ipfs-hash: ipfs-hash,
      created-at: current-time,
      is-public: is-public,
      likes-count: u0,
      completion-count: u0
    })
    
    (ok plan-id)))

;; Add friend
(define-public (add-friend-v2 (friend principal))
  (let ((user tx-sender)
        (current-time (get-current-timestamp)))
    
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR-UNAUTHORIZED)
    (asserts! (not (is-eq user friend)) ERR-INVALID-INPUT)
    (asserts! (is-none (map-get? friendships { user1: user, user2: friend })) ERR-ALREADY-EXISTS)
    
    ;; Create friendship (bidirectional)
    (map-set friendships { user1: user, user2: friend } {
      created-timestamp: current-time,
      interaction-count: u0,
      is-active: true
    })
    
    (map-set friendships { user1: friend, user2: user } {
      created-timestamp: current-time,
      interaction-count: u0,
      is-active: true
    })
    
    (ok true)))

;; ============================================================================
;; PRIVATE FUNCTIONS
;; ============================================================================

;; Update user statistics
(define-private (update-user-stats-v2 (user principal) (steps uint) (calories uint) (workout-duration uint))
  (let ((current-stats (default-to 
          {total-steps: u0, total-calories-burned: u0, total-workouts: u0, current-streak: u0,
           longest-streak: u0, avg-daily-steps: u0, weekly-steps: u0, monthly-steps: u0, 
           last-active-date: u0}
          (map-get? user-stats user)))
        (current-date (get-current-date)))
    
    (map-set user-stats user (merge current-stats {
      total-steps: (+ (get total-steps current-stats) steps),
      total-calories-burned: (+ (get total-calories-burned current-stats) calories),
      total-workouts: (+ (get total-workouts current-stats) u1),
      weekly-steps: (+ (get weekly-steps current-stats) steps),
      last-active-date: current-date
    }))
    
    true))

;; Check and award achievements
(define-private (check-achievements-v2 (user principal) (steps uint) (calories uint))
  (begin
    ;; 10K steps achievement
    (if (>= steps u10000) 
        (map-set user-achievements { user: user, achievement-id: u1 } {
          earned-timestamp: (get-current-timestamp),
          progress-value: steps,
          celebration-shared: false
        })
        true)
    
    ;; 500 calories achievement
    (if (>= calories u500) 
        (map-set user-achievements { user: user, achievement-id: u2 } {
          earned-timestamp: (get-current-timestamp),
          progress-value: calories,
          celebration-shared: false
        })
        true)
    
    true))

;; Award points to user
(define-private (award-points-v2 (user principal) (steps uint))
  (let ((current-profile (unwrap! (map-get? user-profiles user) false))
        (points-earned (* steps (var-get points-per-step))))
    
    (map-set user-profiles user (merge current-profile {
      total-points: (+ (get total-points current-profile) points-earned),
      level: (+ (/ (+ (get total-points current-profile) points-earned) u1000) u1)
    }))
    
    true))

;; ============================================================================
;; ADMIN FUNCTIONS
;; ============================================================================

;; Pause/unpause contract
(define-public (set-contract-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (var-set contract-paused paused)
    (ok true)))

;; Update points per step
(define-public (set-points-per-step (points uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (asserts! (<= points u10) ERR-INVALID-INPUT)
    (var-set points-per-step points)
    (ok true)))