export namespace JiraIssue {
    export interface Task {
        expand: string
        id: string
        self: string
        key: string
        fields: Fields
    }

    interface Fields {
        issuetype: Issuetype
        parent: Parent
        timespent: number
        project: Project
        fixVersions: any[]
        aggregatetimespent: any
        resolution: Resolution
        resolutiondate: string
        workratio: number
        lastViewed: any
        watches: Watches
        created: string
        priority: Priority
        labels: string[]
        timeestimate: any
        aggregatetimeoriginalestimate: any
        versions: any[]
        issuelinks: any[]
        assignee: User
        updated: string
        status: Status
        components: any[]
        timeoriginalestimate: any
        description: string
        aggregatetimeestimate: any
        summary: string
        creator: User
        subtasks: any[]
        reporter: User
        aggregateprogress: Aggregateprogress
        environment: any
        duedate: any
        progress: Progress
        votes: Votes
    }

    interface Issuetype {
        self: string
        id: string
        description: string
        iconUrl: string
        name: string
        subtask: boolean
        avatarId: number
    }

    interface Parent {
        id: string
        key: string
        self: string
        fields: Fields
    }

    interface Fields {
        summary: string
        status: Status
        priority: Priority
        issuetype: Issuetype
    }

    interface Status {
        self: string
        description: string
        iconUrl: string
        name: string
        id: string
        statusCategory: StatusCategory
    }

    interface StatusCategory {
        self: string
        id: number
        key: string
        colorName: string
        name: string
    }

    interface Issuetype {
        self: string
        id: string
        description: string
        iconUrl: string
        name: string
        subtask: boolean
        avatarId: number
    }

    interface Project {
        self: string
        id: string
        key: string
        name: string
        projectTypeKey: string
        avatarUrls: AvatarUrls
        projectCategory: ProjectCategory
    }

    interface AvatarUrls {
        "48x48": string
        "24x24": string
        "16x16": string
        "32x32": string
    }

    interface ProjectCategory {
        self: string
        id: string
        description: string
        name: string
    }

    interface Resolution {
        self: string
        id: string
        description: string
        name: string
    }

    interface Watches {
        self: string
        watchCount: number
        isWatching: boolean
    }

    export interface Priority {
        self: string
        iconUrl: string
        name: string
        id: string
    }

    interface Status {
        self: string
        description: string
        iconUrl: string
        name: string
        id: string
        statusCategory: StatusCategory
    }

    interface StatusCategory {
        self: string
        id: number
        key: string
        colorName: string
        name: string
    }

    export interface User {
        self: string
        name: string
        key: string
        emailAddress: string
        avatarUrls: AvatarUrls
        displayName: string
        active: boolean
        timeZone: string
    }

    interface Aggregateprogress {
        progress: number
        total: number
    }

    interface Progress {
        progress: number
        total: number
    }

    interface Votes {
        self: string
        votes: number
        hasVoted: boolean
    }
}

export namespace JiraCommits {
    export interface Commits {
        errors: any[]
        detail: Detail[]
    }

    interface Detail {
        repositories: Repository[]
        _instance: Instance
    }

    interface Repository {
        name: string
        avatar: string
        avatarDescription: string
        url: string
        parent: Parent
        commits: Commit[]
    }

    interface Parent {
        name: string
        avatar: string
        avatarDescription: string
        url: string
    }

    interface Commit {
        id: string
        displayId: string
        authorTimestamp: string
        url: string
        author: Author
        fileCount: number
        merge: boolean
        message: string
        files: File[]
    }

    interface Author {
        name: string
        avatar: string
    }

    interface File {
        path: string
        url: string
        changeType: ChangeType
        linesAdded: number
        linesRemoved: number
    }

    export enum ChangeType {
        MODIFIED = 'MODIFIED',
        DELETED = 'DELETED',
        MOVED  = 'MOVED',
        ADDED  = 'ADDED',
        COPIED  = 'COPIED',
        UNKNOWN  = 'UNKNOWN',
    }

    interface Instance {
        singleInstance: boolean
        primary: boolean
        applicationLinkId: string
        baseUrl: string
        name: string
        typeName: string
        id: string
        type: string
    }
}

export namespace JiraPullRequests {
    export interface PullRequests {
        errors: any[]
        detail: Detail[]
    }

    interface Detail {
        branches: Branch[]
        pullRequests: PullRequest[]
        repositories: any[]
        _instance: Instance
    }

    interface Branch {
        name: string
        url: string
        createPullRequestUrl: string
        repository: Repository
    }

    interface Repository {
        name: string
        avatar: string
        avatarDescription: string
        url: string
        parent: Parent
    }

    interface Parent {
        name: string
        avatar: string
        avatarDescription: string
        url: string
    }

    interface PullRequest {
        author: Author
        id: string
        name: string
        commentCount: number
        source: Source
        destination: Destination
        reviewers: Reviewer[]
        status: string
        url: string
        lastUpdate: string
    }

    interface Author {
        name: string
        avatar: string
    }

    interface Source {
        branch: string
        repository: Repository
        url: string
    }

    interface Destination {
        branch: string
        repository: Repository
        url: string
    }

    interface Reviewer {
        name: string
        avatar: string
        approved: boolean
    }

    interface Instance {
        singleInstance: boolean
        primary: boolean
        applicationLinkId: string
        baseUrl: string
        name: string
        typeName: string
        id: string
        type: string
    }
}

export namespace JiraWorkLog {
    export interface WorkLogRoot {
        startAt: number
        maxResults: number
        total: number
        worklogs: WorkLog[]
    }

    export interface WorkLog {
        self: string
        author: Author
        updateAuthor: UpdateAuthor
        created: string
        updated: string
        started: string
        timeSpent: string
        timeSpentSeconds: number
        id: string
        issueId: string
    }

    interface Author {
        self: string
        accountId: string
        emailAddress: string
        avatarUrls: AvatarUrls
        displayName: string
        active: boolean
        timeZone: string
        accountType: string
    }

    interface AvatarUrls {
        "48x48": string
        "24x24": string
        "16x16": string
        "32x32": string
    }

    interface UpdateAuthor {
        self: string
        accountId: string
        emailAddress: string
        avatarUrls: AvatarUrls
        displayName: string
        active: boolean
        timeZone: string
        accountType: string
    }
}
