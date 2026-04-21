/**
 * @file contracts.js
 * Canonical JSDoc type definitions for every MindBridge API boundary.
 *
 * This file has no runtime value — import it only for IDE type-hints:
 *   import type {} from '@/api/contracts'   // (TypeScript / JSDoc aware)
 *
 * Backend and frontend developers MUST keep these in sync with the
 * actual API spec.  The mock handlers in src/mocks/handlers.js must
 * also return objects that satisfy these shapes.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/**
 * ISO-8601 date-time string, e.g. "2026-04-13T14:00:00.000Z"
 * @typedef {string} ISODateString
 */

/**
 * UUID v4 string, e.g. "550e8400-e29b-41d4-a716-446655440000"
 * @typedef {string} UUIDV4
 */

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} AuthSignInRequest
 * @property {string} email      - Registered email address
 * @property {string} password   - Plain-text password (HTTPS only)
 */

/**
 * @typedef {Object} AuthSignUpRequest
 * @property {string} name       - Display name
 * @property {string} email      - New account email
 * @property {string} password   - Plain-text password (HTTPS only)
 */

/**
 * @typedef {'seeker'|'mentor'|'admin'} UserRole
 */

/**
 * @typedef {'active'|'pending'|'suspended'} UserStatus
 */

/**
 * @typedef {Object} AuthUser
 * @property {UUIDV4}      id        - Unique user id
 * @property {string}      name      - Display name
 * @property {string}      email     - Email address
 * @property {UserRole}    role      - Account role
 * @property {UserStatus}  status    - Account status
 * @property {string}      [avatar]  - Avatar URL or CSS gradient string
 * @property {ISODateString} createdAt
 */

/**
 * @typedef {Object} AuthSignInResponse
 * @property {string}   token       - Bearer JWT
 * @property {AuthUser} user        - Authenticated user record
 */

/**
 * @typedef {AuthSignInResponse} AuthSignUpResponse
 */

/**
 * @typedef {Object} AuthMeResponse
 * @property {AuthUser} user
 */

/**
 * @typedef {Object} AuthSignOutResponse
 * @property {boolean} ok
 */

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

/**
 * @typedef {'general'|'anxiety'|'recovery'|'relationships'|'grief'} PostCategory
 */

/**
 * @typedef {Object} FeedPost
 * @property {UUIDV4}      id          - Post id
 * @property {string}      authorId    - Author user id
 * @property {string}      authorName  - Display name (may be 'Anonymous')
 * @property {boolean}     anonymous   - Whether posted anonymously
 * @property {PostCategory} category
 * @property {string}      content     - Post body text (max 2000 chars)
 * @property {number}      likes       - Aggregated like count
 * @property {boolean}     likedByMe   - Whether the current user liked it
 * @property {number}      comments    - Aggregated comment count
 * @property {ISODateString} createdAt
 */

/**
 * @typedef {Object} FeedPostsResponse
 * @property {FeedPost[]} posts
 * @property {{ total: number, page: number, pageSize: number }} meta
 */

/**
 * @typedef {Object} CreatePostRequest
 * @property {PostCategory} category
 * @property {string}       content
 * @property {boolean}      [anonymous=false]
 */

/**
 * @typedef {Object} CreatePostResponse
 * @property {FeedPost} post
 */

/**
 * @typedef {Object} LikeResponse
 * @property {UUIDV4} postId
 * @property {number} likes       - Updated total like count
 * @property {boolean} likedByMe  - New liked state
 */

// ---------------------------------------------------------------------------
// Mentors
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} MentorProfile
 * @property {string}  [bio]       - Short bio / personal story
 * @property {string}  [quote]     - Favourite motivation quote
 * @property {string}  [avatarUrl] - Profile picture URL
 */

/**
 * @typedef {Object} MentorExpertise
 * @property {string[]} topics       - Topic slugs, e.g. ['anxiety', 'social-media']
 * @property {string[]} styles       - Support styles, e.g. ['gentle-accountability']
 * @property {string[]} [specialties]- Freeform specialty labels
 */

/**
 * @typedef {Object} MentorStats
 * @property {number} ratingAvg              - Aggregate star rating (0-5)
 * @property {number} sessionsCompleted      - Lifetime completed sessions
 * @property {number} [responseTimeMinutesP50] - Median first-response time
 * @property {number} [activityScore30d]     - 0-100 rolling activity score
 */

/**
 * @typedef {Object} MentorAvailability
 * @property {boolean} online          - Currently reachable
 * @property {number}  [capacityOpen]  - Remaining session slots (0-10)
 * @property {string}  [officeHours]   - Human-readable schedule description
 */

/**
 * @typedef {'pending'|'verified'|'revoked'} VerificationStatus
 */

/**
 * @typedef {Object} MentorCredentials
 * @property {number}             yearsExperience
 * @property {VerificationStatus} verificationStatus
 * @property {string[]}           [certifications]
 */

/**
 * Full backend mentor schema (server side).
 * The frontend normalises this into {@link MentorUi} via `toUiMentor()`.
 * @typedef {Object} MentorBackend
 * @property {UUIDV4}             id
 * @property {string}             displayName
 * @property {'recovered'|'mid-recovery'|'early-recovery'|'professional'} stage
 * @property {string}             [role]
 * @property {string[][]}         [tags]          - [[slug, label], ...]
 * @property {MentorProfile}      profile
 * @property {MentorExpertise}    expertise
 * @property {MentorStats}        stats
 * @property {MentorAvailability} availability
 * @property {MentorCredentials}  credentials
 */

/**
 * Front-end mentor shape produced by `toUiMentor()`.
 * @typedef {Object} MentorUi
 * @property {UUIDV4}  id
 * @property {string}  initials
 * @property {string}  name
 * @property {string}  avatar      - URL or CSS gradient
 * @property {string}  role
 * @property {number}  yrs         - Years of experience
 * @property {number}  helped      - Sessions completed
 * @property {number}  rating      - 0-5 star rating
 * @property {boolean} online
 * @property {string[]} topics
 * @property {string[]} style
 * @property {string}  stage
 * @property {string}  quote
 * @property {string}  bio
 * @property {string[][]} tags
 */

/**
 * @typedef {Object} ScoreComponents
 * @property {number} topics      - Topic-overlap sub-score (0-100)
 * @property {number} style       - Style-overlap sub-score (0-100)
 * @property {number} stage       - Stage-compatible sub-score (0-100)
 * @property {number} availability - Availability sub-score (0-100)
 * @property {number} quality     - Quality composite sub-score (0-100)
 * @property {number} safetyPenalty - Deducted for risk flags (0-100)
 */

/**
 * One item in a match response — mentor + match metadata.
 * @typedef {Object} MatchItem
 * @property {MentorBackend}   mentor
 * @property {number}          score       - Overall match score (0-100)
 * @property {string[]}        reasons     - Human-readable match reasons
 * @property {ScoreComponents} components  - Sub-score breakdown
 */

/**
 * @typedef {Object} MatchRequest
 * @property {{ id: UUIDV4, topics: string[], style: string[], stage: string }} seeker
 * @property {Object<string, number>} [weights] - Custom component weights
 */

/**
 * Direct (non-enveloped) match response body.
 * Also accepted: `{ data: MatchResponse }` (enveloped).
 * @typedef {Object} MatchResponse
 * @property {MatchItem[]} matches
 * @property {{ total: number }} [meta]
 */

/**
 * Mentor catalog (paginated list endpoint).
 * @typedef {Object} MentorCatalogResponse
 * @property {MentorBackend[]} mentors
 * @property {{ total: number, page: number, pageSize: number }} meta
 */

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/**
 * @typedef {'CRISIS'|'HIGH'|'MEDIUM'|'LOW'} FlagSeverity
 */

/**
 * @typedef {'pending'|'reviewed'} FlagStatus
 */

/**
 * @typedef {Object} AdminFlag
 * @property {UUIDV4}       id
 * @property {FlagSeverity} severity
 * @property {FlagStatus}   status
 * @property {string}       type     - Short content-type label
 * @property {string}       user     - Display name of flagged user
 * @property {string}       content  - Excerpt of flagged content
 * @property {ISODateString} time
 */

/**
 * @typedef {Object} AdminFlagsResponse
 * @property {AdminFlag[]} flags
 */

/**
 * @typedef {Object} AdminUser
 * @property {UUIDV4}     id
 * @property {string}     name
 * @property {string}     email
 * @property {UserRole}   role
 * @property {UserStatus} status
 * @property {ISODateString} joined
 */

/**
 * @typedef {Object} AdminUsersResponse
 * @property {AdminUser[]} users
 */

/**
 * @typedef {Object} AdminUserPatch
 * @property {UserStatus} [status]
 * @property {UserRole}   [role]
 */

/**
 * @typedef {Object} AdminUpdateUserResponse
 * @property {AdminUser} user
 */

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} AccountExportResponse
 * @property {string} fileName
 * @property {Object} data
 */

/**
 * @typedef {Object} AccountDeactivateResponse
 * @property {boolean} ok
 */
