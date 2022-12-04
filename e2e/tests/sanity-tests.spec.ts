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
import { test, expect } from '@playwright/test';
import { ToDoListHomePage } from '../page-objects/todo-list-page';
import words from 'random-words';

test.describe('Sanity Suite', () => {
  test('user can add a to do list item', async ({ page }) => {
    const todoHomePage = new ToDoListHomePage(page);
    todoHomePage.goTo();
    await todoHomePage.addNewToDo(words({ max: 4, join: ' ' }));
    const num = await todoHomePage.getNumberOfTasksLeft();
    expect(num).toEqual('1');
  });

  test('a new item to the list is added at the bottom', async ({ page }) => {
    const todoHomePage = new ToDoListHomePage(page);
    todoHomePage.goTo();
    const testWords = words({ max: 4, join: ' ' });
    await todoHomePage.addNewToDo('Task');
    await todoHomePage.addNewToDo(testWords);
    expect(await(todoHomePage.getLastTask())).toEqual(testWords);
  });
});


