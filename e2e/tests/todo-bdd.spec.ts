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

import type { BrowserContext, Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { ToDoListHomePage } from '../page-objects/todo-list-page';
import words from 'random-words';

test.describe('BDD Suite', () => {
  let page: Page;
  let todoHomePage: ToDoListHomePage;
  let browserContext: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    todoHomePage = new ToDoListHomePage(page);
    await todoHomePage.goTo();
  });

  test.describe.serial('Test: Add ToDo Item', () => {
    const taskName = words({ exactly: 3, join: ' ' });
    test('Given I am a user', async ({ }) => {
      await todoHomePage.goTo();
    });
    test('When I create a new todo item',async ({ }) => {
      await todoHomePage.addNewToDo(taskName);
    });
    test('Then it appears last on my todo list',async ({ }) => {
      const num = await todoHomePage.getNumberOfTasksLeft();
      expect(num).toEqual('1');
      expect(await(todoHomePage.getLastTask())).toEqual(taskName);
    });
  });

  test.describe.serial('Test: Edit ToDo Item', () => {
    const taskName = words({ exactly: 3, join: ' ' });
    const editedTaskName = words({ exactly: 4, join: ' ' });
    test('Given I have created a todo item', async ({ }) => {
      await todoHomePage.addNewToDo(taskName);
    });
    test('When I edit a todo item',async ({ }) => {
      await todoHomePage.updateSelectedTask(taskName, editedTaskName);
    });
    test('Then the todo item gets updated with the new changes',async ({ }) => {
      expect(await(todoHomePage.isTaskPresent(taskName))).toBeFalsy();
      expect(await(todoHomePage.isTaskPresent(editedTaskName))).toBeTruthy();
    });
  });

  test.describe.serial('Test: Delete ToDo Item', () => {
    const taskNameToDelete = words({ exactly: 3, join: ' ' });
    const taskNameTwo = words({ exactly: 3, join: ' ' });
    test('Given I have created a todo item', async ({ }) => {
      await todoHomePage.addNewToDo(taskNameToDelete);
      await todoHomePage.addNewToDo(taskNameTwo);
    });
    test('When I delete a todo item using the red X', async ({ }) => {
      await todoHomePage.removeTask(taskNameToDelete);
    });
    test('Then the todo item is removed from my todo list',async ({ }) => {
      await todoHomePage.goToAll();
      expect(await(todoHomePage.isTaskPresent(taskNameToDelete))).toBeFalsy();
    });
  });

  test.describe.serial('Test: Mark ToDo Item as Complete', () => {
    const taskName = words({ exactly: 3, join: ' ' });
    test('Given I have created a todo item', async ({ }) => {
      await todoHomePage.addNewToDo(taskName);
    });
    test('When I mark a todo item as completed', async ({ }) => {
      await todoHomePage.toggleItem(taskName);
    });
    test('Then it is marked with a green check mark', async ({ }) => {
      expect(await(todoHomePage.isCheckboxSelectedForTask(taskName))).toBeTruthy();
    });
    test('And it is crossed off my todo list with a Strikethrough', async ({ }) => {
      expect(await(todoHomePage.isTextStruckThrough(taskName))).toBeTruthy();
    });
  });

  test.describe.serial('Test: Only Not Completed Tasks show in the active tab', () => {
    const taskNameActive = words({ exactly: 3, join: ' ' });
    const taskNameCompleted = words({ exactly: 4, join: ' ' });
    test('Given I have marked a todo item as complete', async ({ }) => {
      await todoHomePage.addNewToDo(taskNameActive);
      await todoHomePage.addNewToDo(taskNameCompleted);
      await todoHomePage.toggleItem(taskNameCompleted);
    });
    test('When I view the Active list', async ({ }) => {
      await todoHomePage.goToActive();
    });
    test('Then only Active (Not Completed) todo items are shown', async ({ }) => {
      expect(await(todoHomePage.isTaskPresent(taskNameCompleted))).toBeFalsy();
      expect(await(todoHomePage.isTaskPresent(taskNameActive))).toBeTruthy();
    });
  });

  test.describe.serial('Test: Clear Completed', () => {
    const taskNameActive = words({ exactly: 3, join: ' ' });
    const taskNameCompleted = words({ exactly: 4, join: ' ' });
    test('Given I have marked a todo item as complete', async ({ }) => {
      await todoHomePage.addNewToDo(taskNameActive);
      await todoHomePage.addNewToDo(taskNameCompleted);
      await todoHomePage.toggleItem(taskNameCompleted);
    });
    test('When I click “Clear Completed”', async ({ }) => {
      await todoHomePage.clickClearCompleted();
    });
    test('Then the completed todo item is removed from my todo list', async ({ }) => {
      expect(await(todoHomePage.isTaskPresent(taskNameCompleted))).toBeFalsy();
      todoHomePage.goToAll();
      expect(await(todoHomePage.isTaskPresent(taskNameCompleted))).toBeFalsy();
    });
    test('And the todo item is moved to the Completed list', async ({ }) => {
      todoHomePage.goToCompleted();
      expect(await(todoHomePage.isTaskPresent(taskNameCompleted))).toBeTruthy();
    });
  });
});
