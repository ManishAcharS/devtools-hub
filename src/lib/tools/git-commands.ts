export interface GitCommandEntry {
  section: string;
  command: string;
  description: string;
}

export const GIT_CHEATSHEET: GitCommandEntry[] = [
  {
    section: 'Setup',
    command: 'git config --global user.name "Name"',
    description: 'Set the name attached to your commits',
  },
  {
    section: 'Setup',
    command: 'git config --global user.email "you@example.com"',
    description: 'Set the email attached to your commits',
  },
  {
    section: 'Setup',
    command: 'git config --global core.editor "code --wait"',
    description: 'Set the default text editor',
  },
  {
    section: 'Setup',
    command: 'git config --global init.defaultBranch main',
    description: 'Use main as the default branch for new repos',
  },
  {
    section: 'Setup',
    command: 'git config --list',
    description: 'List all current Git configuration',
  },
  {
    section: 'Setup',
    command: 'git init',
    description: 'Initialize a new repository in the current directory',
  },
  {
    section: 'Setup',
    command: 'git clone <url>',
    description: 'Clone a remote repository into a local folder',
  },
  {
    section: 'Setup',
    command: 'git clone <url> <dir>',
    description: 'Clone a repository into a specific directory',
  },

  {
    section: 'Staging',
    command: 'git status',
    description: 'Show working tree and staging area state',
  },
  { section: 'Staging', command: 'git add <file>', description: 'Stage a specific file' },
  {
    section: 'Staging',
    command: 'git add .',
    description: 'Stage all changes in the current directory',
  },
  {
    section: 'Staging',
    command: 'git add -p',
    description: 'Stage changes interactively, hunk by hunk',
  },
  {
    section: 'Staging',
    command: 'git rm <file>',
    description: 'Remove a file from the working tree and stage the deletion',
  },
  {
    section: 'Staging',
    command: 'git mv <old> <new>',
    description: 'Rename or move a file and stage the change',
  },
  {
    section: 'Staging',
    command: 'git reset <file>',
    description: 'Unstage a file, keeping its changes',
  },
  {
    section: 'Staging',
    command: 'git diff --staged',
    description: 'Show changes that are staged for commit',
  },

  {
    section: 'Committing',
    command: 'git commit -m "message"',
    description: 'Commit staged changes with an inline message',
  },
  {
    section: 'Committing',
    command: 'git commit -am "message"',
    description: 'Stage tracked changes and commit in one step',
  },
  {
    section: 'Committing',
    command: 'git commit --amend',
    description: 'Edit the last commit message or add changes to it',
  },
  {
    section: 'Committing',
    command: 'git commit --amend --no-edit',
    description: 'Add staged changes to the last commit without editing',
  },
  {
    section: 'Committing',
    command: 'git log --oneline',
    description: 'Show a compact, one-line commit history',
  },
  {
    section: 'Committing',
    command: 'git log --oneline --graph --all',
    description: 'Show history as an ASCII graph across branches',
  },
  {
    section: 'Committing',
    command: 'git blame <file>',
    description: 'Show who changed each line and when',
  },

  { section: 'Branching & Merging', command: 'git branch', description: 'List local branches' },
  {
    section: 'Branching & Merging',
    command: 'git branch -a',
    description: 'List local and remote branches',
  },
  {
    section: 'Branching & Merging',
    command: 'git branch <name>',
    description: 'Create a new branch at HEAD',
  },
  {
    section: 'Branching & Merging',
    command: 'git branch -d <name>',
    description: 'Delete a fully merged branch',
  },
  {
    section: 'Branching & Merging',
    command: 'git branch -D <name>',
    description: 'Force-delete a branch, even unmerged',
  },
  {
    section: 'Branching & Merging',
    command: 'git checkout <branch>',
    description: 'Switch to an existing branch',
  },
  {
    section: 'Branching & Merging',
    command: 'git checkout -b <name>',
    description: 'Create and switch to a new branch',
  },
  {
    section: 'Branching & Merging',
    command: 'git switch <branch>',
    description: 'Switch to a branch (modern alternative to checkout)',
  },
  {
    section: 'Branching & Merging',
    command: 'git switch -c <name>',
    description: 'Create and switch to a new branch (modern)',
  },
  {
    section: 'Branching & Merging',
    command: 'git merge <branch>',
    description: 'Merge a branch into the current branch',
  },
  {
    section: 'Branching & Merging',
    command: 'git merge --no-ff <branch>',
    description: 'Merge with a merge commit even if fast-forward is possible',
  },
  {
    section: 'Branching & Merging',
    command: 'git rebase <branch>',
    description: 'Replay current commits on top of another branch',
  },
  {
    section: 'Branching & Merging',
    command: 'git rebase -i HEAD~3',
    description: 'Interactive rebase to squash, reword, or reorder commits',
  },
  {
    section: 'Branching & Merging',
    command: 'git cherry-pick <hash>',
    description: 'Apply a specific commit onto the current branch',
  },

  {
    section: 'Remote & Sync',
    command: 'git remote -v',
    description: 'List configured remote repositories',
  },
  {
    section: 'Remote & Sync',
    command: 'git remote add origin <url>',
    description: 'Add a remote named origin',
  },
  { section: 'Remote & Sync', command: 'git remote remove <name>', description: 'Remove a remote' },
  {
    section: 'Remote & Sync',
    command: 'git fetch',
    description: 'Download remote changes without merging',
  },
  {
    section: 'Remote & Sync',
    command: 'git pull',
    description: 'Fetch and merge the upstream branch',
  },
  {
    section: 'Remote & Sync',
    command: 'git pull --rebase',
    description: 'Fetch and rebase local commits on top of upstream',
  },
  {
    section: 'Remote & Sync',
    command: 'git push',
    description: 'Push commits to the upstream branch',
  },
  {
    section: 'Remote & Sync',
    command: 'git push -u origin <branch>',
    description: 'Push a branch and set its upstream tracking',
  },
  {
    section: 'Remote & Sync',
    command: 'git push --force-with-lease',
    description: 'Force-push safely, refusing if the remote moved',
  },
  {
    section: 'Remote & Sync',
    command: 'git push origin --delete <branch>',
    description: 'Delete a branch on the remote',
  },

  { section: 'History & Diff', command: 'git log', description: 'Show the full commit history' },
  {
    section: 'History & Diff',
    command: 'git log -p',
    description: 'Show history with the full patch of each commit',
  },
  {
    section: 'History & Diff',
    command: 'git log --stat',
    description: 'Show history with file change statistics',
  },
  {
    section: 'History & Diff',
    command: 'git log --follow -- <file>',
    description: 'Show history of a file, including renames',
  },
  {
    section: 'History & Diff',
    command: 'git diff',
    description: 'Show unstaged changes in the working tree',
  },
  {
    section: 'History & Diff',
    command: 'git diff <commit1> <commit2>',
    description: 'Compare two commits',
  },
  {
    section: 'History & Diff',
    command: 'git show <hash>',
    description: 'Show the details of a single commit',
  },

  {
    section: 'Undoing',
    command: 'git restore <file>',
    description: 'Discard unstaged changes in a file',
  },
  {
    section: 'Undoing',
    command: 'git restore --staged <file>',
    description: 'Unstage a file, keeping its changes',
  },
  {
    section: 'Undoing',
    command: 'git reset --soft HEAD~1',
    description: 'Undo the last commit, keeping changes staged',
  },
  {
    section: 'Undoing',
    command: 'git reset HEAD~1',
    description: 'Undo the last commit, keeping changes unstaged',
  },
  {
    section: 'Undoing',
    command: 'git reset --hard HEAD~1',
    description: 'Undo the last commit and discard its changes',
  },
  {
    section: 'Undoing',
    command: 'git revert <hash>',
    description: 'Create a new commit that undoes a previous one',
  },

  {
    section: 'Stash',
    command: 'git stash',
    description: 'Save working tree changes in a temporary stash',
  },
  {
    section: 'Stash',
    command: 'git stash push -m "message"',
    description: 'Stash changes with a descriptive message',
  },
  { section: 'Stash', command: 'git stash list', description: 'List all stashes' },
  { section: 'Stash', command: 'git stash pop', description: 'Apply the latest stash and drop it' },
  {
    section: 'Stash',
    command: 'git stash apply',
    description: 'Apply the latest stash without dropping it',
  },
  { section: 'Stash', command: 'git stash drop', description: 'Discard the latest stash' },
  { section: 'Stash', command: 'git stash clear', description: 'Discard every stash' },

  { section: 'Tags', command: 'git tag', description: 'List all tags' },
  {
    section: 'Tags',
    command: 'git tag -a v1.0.0 -m "message"',
    description: 'Create an annotated tag at HEAD',
  },
  { section: 'Tags', command: 'git tag v1.0.0 <hash>', description: 'Tag a specific commit' },
  {
    section: 'Tags',
    command: 'git push origin v1.0.0',
    description: 'Push a single tag to the remote',
  },
  {
    section: 'Tags',
    command: 'git push origin --tags',
    description: 'Push all tags to the remote',
  },
  { section: 'Tags', command: 'git tag -d v1.0.0', description: 'Delete a local tag' },

  {
    section: 'Aliases',
    command: 'git config --global alias.co checkout',
    description: 'Shorten checkout to "git co"',
  },
  {
    section: 'Aliases',
    command: 'git config --global alias.br branch',
    description: 'Shorten branch to "git br"',
  },
  {
    section: 'Aliases',
    command: 'git config --global alias.st status',
    description: 'Shorten status to "git st"',
  },
  {
    section: 'Aliases',
    command: 'git config --global alias.unstage "reset HEAD --"',
    description: 'Add an "unstage" alias',
  },
  {
    section: 'Aliases',
    command: 'git config --global alias.last "log -1 HEAD"',
    description: 'Show the last commit with "git last"',
  },
];

export const GIT_SECTIONS: string[] = [...new Set(GIT_CHEATSHEET.map((entry) => entry.section))];
