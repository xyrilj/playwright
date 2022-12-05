/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { BrowserContext, Page} from '@playwright/test';
import { test, expect } from '@playwright/test';
import { ToDoListHomePage } from '../page-objects/todo-list-page';
import words from 'random-words';

test.describe.serial('Sanity Suite', () => {
  let page: Page;
  let todoHomePage: ToDoListHomePage;
  let browserContext: BrowserContext;
  let lastCreatedTask: string;

  test.beforeAll(async ({ browser }) => {
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    todoHomePage = new ToDoListHomePage(page);
    await todoHomePage.goTo();
    console.log('Reached');
  });

  test('user can add a to do list item', async ({ }) => {
    await todoHomePage.addNewToDo(words({ exactly: 3, join: ' ' }));
    const num = await todoHomePage.getNumberOfTasksLeft();
    expect(num).toEqual('1');
  });

  test('a item new to the list is added at the bottom', async ({ }) => {
    lastCreatedTask = words({ exactly: 3, join: ' ' });
    await todoHomePage.addNewToDo('Task');
    await todoHomePage.addNewToDo(lastCreatedTask);
    expect(await(todoHomePage.getLastTask())).toEqual(lastCreatedTask);
  });

  test('user can update an added item', async ({  }) => {
    const updatedTaskName = words({ exactly: 3, join: ' ' });
    await todoHomePage.updateSelectedTask(lastCreatedTask, updatedTaskName);
    expect(await(todoHomePage.isTaskPresent(lastCreatedTask))).toBeFalsy();
    expect(await(todoHomePage.isTaskPresent(updatedTaskName))).toBeTruthy();
    lastCreatedTask = updatedTaskName;
  });

  test('user can delete a task', async ({ }) => {
    await todoHomePage.removeTask(lastCreatedTask);
    expect(await(todoHomePage.isTaskPresent(lastCreatedTask))).toBeFalsy();
  });

  test.afterAll(async () => {
    await browserContext.close();
  });

});

