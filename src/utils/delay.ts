/*
 * Jira Ticket: 
 * Zeplin Design: 
 * Feature Document: 
 * Created Date: Thu, 24th Aug 2023, 07:37:45 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

/**
 * A "modern" sleep statement.
 *
 * @param ms The number of milliseconds to wait.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(() => resolve, ms)); 