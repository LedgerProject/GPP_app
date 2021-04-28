/* This file is part of Zenroom (https://zenroom.dyne.org)
 *
 * Copyright (C) 2017-2020 Dyne.org foundation
 * designed, written and maintained by Denis Roio <jaromil@dyne.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

#ifndef __ZENROOM_H__
#define __ZENROOM_H__

/////////////////////////////////////////
// high level api: one simple call

int zenroom_exec(char *script, char *conf, char *keys, char *data);

int zencode_exec(char *script, char *conf, char *keys, char *data);

// in case buffers should be used instead of stdout/err file
// descriptors, this call defines where to print out the output and
// the maximum sizes allowed for it. Output is NULL terminated.
int zenroom_exec_tobuf(char *script, char *conf, char *keys, char *data,
                       char *stdout_buf, size_t stdout_len,
                       char *stderr_buf, size_t stderr_len);
int zencode_exec_tobuf(char *script, char *conf, char *keys, char *data,
                       char *stdout_buf, size_t stdout_len,
                       char *stderr_buf, size_t stderr_len);

////////////////////////////////////////


// lower level api: init (exec_line*) teardown

// heap initialised by the memory manager
typedef struct {
	void* (*malloc)(size_t size);
	void* (*realloc)(void *ptr, size_t size);
	void  (*free)(void *ptr);
	void* (*sys_malloc)(size_t size);
	void* (*sys_realloc)(void *ptr, size_t size);
	void  (*sys_free)(void *ptr);
} zen_mem_t;

#define RANDOM_SEED_LEN 64

#include <stdarg.h>
typedef int (*sprintf_t)( char * buf, char const * fmt, ... );
typedef int (*snprintf_t)( char * buf, size_t count, char const * fmt, ... );
typedef int (*vsprintf_t)( char * buf, char const * fmt, va_list va );
typedef int (*vsnprintf_t)( char * buf, size_t count, char const * fmt, va_list va );


// zenroom context, also available as "_Z" global in lua space
// contents are opaque in lua and available only as lightuserdata
typedef struct {
	void *lua; // (lua_State*)
	zen_mem_t *mem; // memory manager heap

	char *stdout_buf;
	size_t stdout_len;
	size_t stdout_pos;
	size_t stdout_full;

	char *stderr_buf;
	size_t stderr_len;
	size_t stderr_pos;
	size_t stderr_full;

	void *random_generator; // cast to RNG
	char random_seed[RANDOM_SEED_LEN];
	int random_external; // signal when rngseed is external

	int errorlevel;
	void *userdata; // anything passed at init (reserved for caller)

	sprintf_t sprintf;
	snprintf_t snprintf;
	vsprintf_t vsprintf;
	vsnprintf_t vsnprintf;

} zenroom_t;


zenroom_t *zen_init(const char *conf, char *keys, char *data);
int  zen_exec_script(zenroom_t *Z, const char *script);
int  zen_exec_zencode(zenroom_t *Z, const char *script);
void zen_teardown(zenroom_t *zenroom);

#define MAX_LINE 1024 // 1KiB maximum length for a newline terminated line (Zencode)

#ifndef MAX_ZENCODE_LINE
#define MAX_ZENCODE_LINE 512
#endif

#ifndef MAX_CONFIG // for the configuration parser
#define MAX_CONFIG 512
#endif

#ifndef MAX_ZENCODE // maximum size of a zencode script
#define MAX_ZENCODE 16384
#endif

#ifndef MAX_FILE // for cli.c
#define MAX_FILE 2048000 // load max 2MiB files
#endif

#ifndef MAX_STRING // mostly for cli.c
#define MAX_STRING 20480 // max 20KiB strings
#endif

#ifndef MAX_OCTET
#define MAX_OCTET 4096000 // max 4MiB for octets
#endif

#define LUA_BASELIBNAME "_G"

#define ZEN_BITS 32
#ifndef SIZE_MAX
#if ZEN_BITS == 32
#define SIZE_MAX 4294967296
#elif ZEN_BITS == 8
#define SIZE_MAX 65536
#endif
#endif

#endif
