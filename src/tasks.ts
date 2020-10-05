import * as vscode from 'vscode';

export class AdamTaskProvider implements vscode.TaskProvider {
    static TaskType = 'adam';
    private tasks: vscode.Task[] | undefined = undefined;

    constructor(private workspaceFolder: vscode.WorkspaceFolder, private adamPath: string) {}

    public provideTasks(): vscode.Task[] | undefined {
        if (!this.tasks) {
            this.tasks = [];

            const run_task = new vscode.Task(
                {
                    type: AdamTaskProvider.TaskType,
                    task: TaskKind.Run,
                },
                this.workspaceFolder,
                TaskKind.Run,
                AdamTaskProvider.TaskType,
                new vscode.ShellExecution(`${this.adamPath}`, [TaskKind.Run])
            );
            run_task.group = vscode.TaskGroup.Build;
            this.tasks.push(run_task);

            const build_task = new vscode.Task(
                {
                    type: AdamTaskProvider.TaskType,
                    task: TaskKind.Build,
                },
                this.workspaceFolder,
                TaskKind.Build,
                AdamTaskProvider.TaskType,
                new vscode.ShellExecution(`${this.adamPath}`, [TaskKind.Build])
            );
            run_task.group = vscode.TaskGroup.Build;
            this.tasks.push(build_task);

            const clean_task = new vscode.Task(
                {
                    type: AdamTaskProvider.TaskType,
                    task: TaskKind.Clean,
                },
                this.workspaceFolder,
                TaskKind.Clean,
                AdamTaskProvider.TaskType,
                new vscode.ShellExecution(`${this.adamPath}`, [TaskKind.Clean])
            );
            run_task.group = vscode.TaskGroup.Clean;
            this.tasks.push(clean_task);
        }
        return this.tasks;
    }

    public resolveTask(_task: vscode.Task): vscode.Task | undefined {
        const task = _task.definition as AdamTaskDefinition | undefined;

        if (task) {
            _task.execution = new vscode.ShellExecution(`${this.adamPath}`, [task.task]);
            return _task;
        }
        return undefined;
    }
}

interface AdamTaskDefinition extends vscode.TaskDefinition {
    /**
     * The task name
     */
    task: TaskKind;
}

const enum TaskKind {
    Run = 'run',
    Build = 'build',
    Clean = 'clean',
}
