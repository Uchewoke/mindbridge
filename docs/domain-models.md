# Domain Models

## Contents

- [Communities](#communities)
- [Mentors](#mentors)

## Communities

### Slug Table

| Slug | Name | Icon | Accent |
| --- | --- | --- | --- |
| social-media | Social Media Detox | 📱 | #3B5BDB |
| anxiety | Anxiety & Stress | 🫁 | #C2255C |
| alcohol | Alcohol Recovery | 🍂 | #E67700 |
| depression | Depression Support | 🌧️ | #7048E8 |
| gaming | Gaming & Balance | 🎮 | #0CA678 |
| loneliness | Loneliness & Connection | 🤝 | #5B21B6 |

### Community Object Schema

Each community entry follows:

- slug: string
- name: string
- icon: string (emoji)
- accentHex: string (hex)
- desc: string
- members: number
- online: number
- posts: string[]

### Add a New Community

1. Add a new object to COMMUNITIES in src/pages/Communities.jsx.
2. Ensure slug is unique and URL-safe.
3. Provide all schema fields for visual consistency.
4. If needed, update user topics in src/stores/index.js.
5. If introducing new tag taxonomy, extend Tag type map in src/components/ui/index.jsx.
6. Validate both /communities and /communities/:slug rendering.

## Mentors

### Mentor Data Schema

Each mentor in src/pages/Discover.jsx includes:

- id: string
- initials: string
- name: string
- avatar: string
- role: string
- yrs: number
- helped: number
- rating: number
- online: boolean
- topics: string[]
- style: string[]
- stage: string
- avail: number
- exp: number
- activity: number
- quote: string
- bio: string
- tags: Array<[tagType, label]>

### Matching Algorithm

Current score function:

$$
\text{score} =
(\text{topicMatch} \cdot w_{topics}) +
(\text{styleMatch} \cdot w_{style}) +
(\text{stageMatch} \cdot w_{stage}) +
(\text{avail} \cdot w_{avail}) +
(\text{exp} \cdot w_{exp}) +
(\text{activity} \cdot w_{activity})
$$

Rule details:

- topicMatch: 100 when at least one mentor topic intersects user.topics, else 35
- styleMatch: 100 when at least one mentor style intersects user.style, else 55
- stageMatch: 100 if mentor.stage is recovered, else 70
- avail, exp, activity are numeric mentor metrics
- weights come from slider state in Discover page

Behavior notes:

- Weights are independent and not normalized
- Final score is rounded with Math.round
- Mentor list is sorted descending by score

---

Back to [Docs index](../README.md#documentation-index)
