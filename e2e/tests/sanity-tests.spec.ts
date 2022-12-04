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

test('user can add a to do list item', async ({ page }) => {
  const todoHomePage = new ToDoListHomePage(page);
  await todoHomePage.goTo();
  await todoHomePage.addNewToDo('Test task to do');
  const num = await todoHomePage.getNumberOfTasksLeft();
  expect(num).toEqual('1');
});
